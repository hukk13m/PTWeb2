// Adds the numeric IdF field to every Fashion that does not have one yet.
// Existing documents keep every other field, and running the script twice is safe.
const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

async function migrate() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const collection = client.db("FashionData").collection("Fashion");

    const withIdF = await collection
      .find({ IdF: { $type: "number" } })
      .sort({ IdF: 1 })
      .toArray();

    let nextIdF = withIdF.reduce((max, item) => Math.max(max, item.IdF), 0) + 1;

    // Oldest Fashion first so the order stays stable between runs.
    const missing = await collection
      .find({ IdF: { $not: { $type: "number" } } })
      .sort({ created_at: 1, _id: 1 })
      .toArray();

    if (missing.length === 0) {
      console.log(`Migration complete: all ${withIdF.length} Fashion already have IdF.`);
    } else {
      const operations = missing.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { IdF: nextIdF++ } },
        },
      }));
      const result = await collection.bulkWrite(operations);
      console.log(
        `Migration complete: added IdF to ${result.modifiedCount} Fashion document(s). Next IdF is ${nextIdF}.`,
      );
    }

    await collection.createIndex({ IdF: 1 }, { unique: true, sparse: true });
    console.log("Unique index on IdF is ready.");
  } finally {
    await client.close();
  }
}

migrate().catch((error) => {
  console.error("Could not migrate Fashion IdF:", error);
  process.exitCode = 1;
});
