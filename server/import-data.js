// Import the bundled Fashion data (fashion-data.json) into MongoDB.
// Run: npm run import:data          -> only when the collection is empty
//      npm run import:data -- --force  -> replace all Fashion documents
const { MongoClient } = require("mongodb");
const { EJSON } = require("bson");
const fs = require("fs");
const path = require("path");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

async function importData() {
  const file = path.join(__dirname, "fashion-data.json");
  const docs = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => EJSON.parse(line, { relaxed: false }));

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const collection = client.db(process.env.FASHION_DB || "FashionData").collection("Fashion");
    const existing = await collection.countDocuments();

    if (existing > 0 && !process.argv.includes("--force")) {
      console.log(
        `Fashion already has ${existing} document(s). Nothing imported. ` +
          "Use --force to replace them.",
      );
      return;
    }

    if (existing > 0) {
      await collection.deleteMany({});
    }

    await collection.insertMany(docs);
    await collection.createIndex({ IdF: 1 }, { unique: true, sparse: true });
    console.log(`Imported ${docs.length} Fashion document(s).`);
  } finally {
    await client.close();
  }
}

importData().catch((error) => {
  console.error("Could not import Fashion data:", error);
  process.exitCode = 1;
});
