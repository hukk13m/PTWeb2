const assert = require("node:assert/strict");
const { once } = require("node:events");
const test = require("node:test");
const { ObjectId } = require("mongodb");
const { createApp } = require("./index");

class MemoryFashionCollection {
  constructor(items = []) {
    this.items = items;
  }

  find(filter = {}) {
    let items = this.items.filter((item) => {
      if (filter.style && item.style !== filter.style) {
        return false;
      }
      if (filter.IdF && filter.IdF.$type === "number") {
        return typeof item.IdF === "number";
      }
      return true;
    });
    items = [...items];

    const cursor = {
      sort: (spec) => {
        const keys = Object.entries(spec);
        items.sort((left, right) => {
          for (const [key, direction] of keys) {
            const a = left[key];
            const b = right[key];
            if (a === b) {
              continue;
            }
            if (a === undefined) {
              return 1 * direction;
            }
            if (b === undefined) {
              return -1 * direction;
            }
            return (a > b ? 1 : -1) * direction;
          }
          return 0;
        });
        return cursor;
      },
      limit: (count) => {
        items = items.slice(0, count);
        return cursor;
      },
      toArray: async () => items,
    };
    return cursor;
  }

  async findOne(filter) {
    return (
      this.items.find((item) => {
        if (filter._id !== undefined) {
          return item._id.equals ? item._id.equals(filter._id) : item._id === filter._id;
        }
        if (typeof filter.IdF === "number") {
          return item.IdF === filter.IdF;
        }
        return false;
      }) || null
    );
  }

  async insertOne(item) {
    const inserted = { ...item, _id: new ObjectId() };
    this.items.push(inserted);
    return { insertedId: inserted._id };
  }

  async updateOne(filter, update) {
    const item = await this.findOne(filter);
    if (!item) {
      return { matchedCount: 0 };
    }
    Object.assign(item, update.$set);
    return { matchedCount: 1 };
  }

  async deleteOne(filter) {
    const index = this.items.findIndex((item) =>
      item._id.equals ? item._id.equals(filter._id) : item._id === filter._id,
    );
    if (index < 0) {
      return { deletedCount: 0 };
    }
    this.items.splice(index, 1);
    return { deletedCount: 1 };
  }
}

async function startApi(collection) {
  const server = createApp(collection).listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
  };
}

function fashionBody(overrides = {}) {
  return {
    style: "Street Style",
    fashion_subject: "Street look",
    fashion_detail: "<p>Fashion description</p>",
    fashion_image: "https://example.com/fashion.jpg",
    ...overrides,
  };
}

test("Fashion REST API supports sorted/filterable CRUD and explicit errors", async (t) => {
  const older = {
    _id: new ObjectId(),
    ...fashionBody({ fashion_subject: "Older" }),
    IdF: 1,
    created_at: new Date("2025-01-01T00:00:00.000Z"),
  };
  const newer = {
    _id: new ObjectId(),
    ...fashionBody({ style: "Trends", fashion_subject: "Newer" }),
    IdF: 2,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
  };
  const collection = new MemoryFashionCollection([older, newer]);
  const api = await startApi(collection);
  t.after(api.close);

  const allResponse = await fetch(`${api.baseUrl}/fashions`);
  assert.equal(allResponse.status, 200);
  assert.deepEqual(
    (await allResponse.json()).map((item) => item.fashion_subject),
    ["Newer", "Older"],
  );

  const filteredResponse = await fetch(
    `${api.baseUrl}/fashions?style=${encodeURIComponent("Street Style")}`,
  );
  assert.equal(filteredResponse.status, 200);
  assert.deepEqual(
    (await filteredResponse.json()).map((item) => item.fashion_subject),
    ["Older"],
  );

  const detailResponse = await fetch(`${api.baseUrl}/fashions/${older._id}`);
  assert.equal(detailResponse.status, 200);
  assert.equal((await detailResponse.json())._id, older._id.toHexString());

  // IdF is a number, so it can address a Fashion too.
  const byIdFResponse = await fetch(`${api.baseUrl}/fashions/1`);
  assert.equal(byIdFResponse.status, 200);
  assert.equal((await byIdFResponse.json()).fashion_subject, "Older");

  const invalidIdResponse = await fetch(`${api.baseUrl}/fashions/not-an-object-id`);
  assert.equal(invalidIdResponse.status, 400);
  assert.match((await invalidIdResponse.json()).error, /Invalid Fashion id/);

  const missingId = new ObjectId().toHexString();
  const missingResponse = await fetch(`${api.baseUrl}/fashions/${missingId}`);
  assert.equal(missingResponse.status, 404);

  const createResponse = await fetch(`${api.baseUrl}/fashions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fashionBody({ style: "Minimal", IdF: 999 })),
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.style, "Minimal");
  // The server ignores a client IdF and continues the sequence.
  assert.equal(created.IdF, 3);
  assert.ok(created.created_at);

  const updateResponse = await fetch(`${api.baseUrl}/fashions/${created._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fashionBody({ style: "Updated Style", IdF: 1 })),
  });
  assert.equal(updateResponse.status, 200);
  const updated = await updateResponse.json();
  assert.equal(updated.style, "Updated Style");
  assert.equal(updated.created_at, created.created_at);
  assert.equal(updated.IdF, created.IdF);

  const deleteByNumberResponse = await fetch(`${api.baseUrl}/fashions/${created.IdF}`, {
    method: "DELETE",
  });
  assert.equal(deleteByNumberResponse.status, 204);

  const deletedResponse = await fetch(`${api.baseUrl}/fashions/${created._id}`);
  assert.equal(deletedResponse.status, 404);

  const invalidBodyResponse = await fetch(`${api.baseUrl}/fashions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ style: "", fashion_subject: "" }),
  });
  assert.equal(invalidBodyResponse.status, 400);
});

test("database failures return a generic server error response", async (t) => {
  const api = await startApi({
    find() {
      throw new Error("private database connection details");
    },
  });
  t.after(api.close);

  const response = await fetch(`${api.baseUrl}/fashions`);
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Internal server error" });
});

