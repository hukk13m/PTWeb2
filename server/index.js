const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

function createApp(fashionCollection) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(morgan("dev"));
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.json({ service: "server-fashion", status: "ok" });
  });

  const getFashions = async (req, res) => {
    const { style } = req.query;
    if (style !== undefined && (typeof style !== "string" || !style.trim())) {
      return res.status(400).json({ error: "style must be a non-empty string" });
    }

    const filter = style ? { style: style.trim() } : {};
    const fashions = await fashionCollection
      .find(filter)
      .sort({ created_at: -1, _id: -1 })
      .toArray();
    return res.json(fashions);
  };
  app.get("/fashions", getFashions);
  app.get("/api/fashions", getFashions);

  // Look one Fashion up by IdF (number) or by _id (ObjectId or legacy string).
  const findFashion = async (id) => {
    if (/^\d+$/.test(id)) {
      return fashionCollection.findOne({ IdF: Number(id) });
    }
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const byObjectId = await fashionCollection.findOne({ _id: new ObjectId(id) });
    return byObjectId || (await fashionCollection.findOne({ _id: id }));
  };

  app.get("/fashions/:id", async (req, res) => {
    const { id } = req.params;
    if (!/^\d+$/.test(id) && !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Fashion id" });
    }

    const fashion = await findFashion(id);
    if (!fashion) {
      return res.status(404).json({ error: "Fashion not found" });
    }

    return res.json(fashion);
  });

  app.post("/fashions", async (req, res) => {
    const fields = validateFashion(req.body);
    if (fields.error) {
      return res.status(400).json({ error: fields.error });
    }

    // IdF is owned by the server: always the next free number, never a client value.
    const fashion = {
      ...fields.value,
      IdF: await nextIdF(fashionCollection),
      created_at: new Date(),
    };
    try {
      const result = await fashionCollection.insertOne(fashion);
      return res.status(201).json({ ...fashion, _id: result.insertedId });
    } catch (error) {
      if (error && error.code === 11000) {
        return res.status(409).json({ error: "IdF already exists, please retry" });
      }
      throw error;
    }
  });

  const updateFashion = async (req, res) => {
    const id = req.params.id || req.body?._id;
    if (typeof id !== "string" || (!/^\d+$/.test(id) && !ObjectId.isValid(id))) {
      return res.status(400).json({ error: "A valid Fashion id is required" });
    }

    const fields = validateFashion(req.body);
    if (fields.error) {
      return res.status(400).json({ error: fields.error });
    }

    const existing = await findFashion(id);
    if (!existing) {
      return res.status(404).json({ error: "Fashion not found" });
    }

    // Only editable fields are written, so IdF and created_at are preserved.
    const result = await fashionCollection.updateOne(
      { _id: existing._id },
      { $set: fields.value },
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Fashion not found" });
    }

    return res.json(await fashionCollection.findOne({ _id: existing._id }));
  };

  app.put("/fashions/:id", updateFashion);
  app.put("/fashions", updateFashion);

  app.delete("/fashions/:id", async (req, res) => {
    const { id } = req.params;
    if (!/^\d+$/.test(id) && !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Fashion id" });
    }

    const existing = await findFashion(id);
    if (!existing) {
      return res.status(404).json({ error: "Fashion not found" });
    }

    const result = await fashionCollection.deleteOne({ _id: existing._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Fashion not found" });
    }

    return res.status(204).end();
  });

  app.use((error, req, res, next) => {
    console.error("Fashion API error:", error);
    if (res.headersSent) {
      return next(error);
    }

    const status = Number.isInteger(error.status) ? error.status : 500;
    const message = status >= 500 ? "Internal server error" : error.message;
    return res.status(status).json({ error: message });
  });

  return app;
}

// IdF is a small unique number used by the Slug. The next value is the current
// highest IdF plus one, so old documents keep their number and new ones never
// reuse it. The unique index created in start() rejects any duplicate.
async function nextIdF(fashionCollection) {
  const [last] = await fashionCollection
    .find({ IdF: { $type: "number" } })
    .sort({ IdF: -1 })
    .limit(1)
    .toArray();
  return last && typeof last.IdF === "number" ? last.IdF + 1 : 1;
}

function validateFashion(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be an object" };
  }

  const fields = ["style", "fashion_subject", "fashion_detail", "fashion_image"];
  for (const field of fields) {
    if (typeof body[field] !== "string") {
      return { error: `${field} must be a string` };
    }
  }

  const value = {
    style: body.style.trim(),
    fashion_subject: body.fashion_subject.trim(),
    fashion_detail: body.fashion_detail,
    fashion_image: body.fashion_image.trim(),
  };
  if (!value.style || !value.fashion_subject || !value.fashion_image) {
    return { error: "style, fashion_subject, and fashion_image are required" };
  }

  return { value };
}

async function start() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const collection = client.db("FashionData").collection("Fashion");
  try {
    // sparse: old documents without IdF wait for the migration instead of
    // blocking startup with a duplicate null value.
    await collection.createIndex({ IdF: 1 }, { unique: true, sparse: true });
  } catch (error) {
    console.error("Could not create the IdF unique index:", error.message);
  }
  const server = createApp(collection).listen(port, () => {
    console.log(`Fashion API listening on http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close();
    await client.close();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Could not start Fashion API:", error);
    process.exitCode = 1;
  });
}

module.exports = { createApp, validateFashion };
