const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

async function migrate() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const collection = client.db("FashionData").collection("Fashion");
    const fashions = await collection
      .find({ created_at: { $exists: false } })
      .project({ _id: 1 })
      .toArray();

    if (fashions.length === 0) {
      console.log("Migration complete: every Fashion already has created_at.");
      return;
    }

    const result = await collection.bulkWrite(
      fashions.map(({ _id }) => {
        const hexId = String(_id);
        if (!/^[0-9a-f]{24}$/i.test(hexId)) {
          throw new Error(`Fashion document has a non-ObjectId _id: ${hexId}`);
        }
        const createdAt = new Date(Number.parseInt(hexId.slice(0, 8), 16) * 1000);
        return {
          updateOne: {
            filter: { _id },
            update: { $set: { created_at: createdAt } },
          },
        };
      }),
    );
    console.log(`Migration complete: added created_at to ${result.modifiedCount} Fashion document(s).`);
  } finally {
    await client.close();
  }
}

migrate().catch((error) => {
  console.error("Could not migrate Fashion dates:", error);
  process.exitCode = 1;
});
