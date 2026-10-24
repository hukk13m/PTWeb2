const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const sampleFashions = [
  {
    style: "Flex",
    fashion_subject: "Monochrome with a modern edge",
    fashion_detail: "<p>Simple monochrome pieces make a sharp, flexible everyday outfit.</p>",
    fashion_image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900",
  },
  {
    style: "Kids Style",
    fashion_subject: "Playful color for little trendsetters",
    fashion_detail: "<p>Bright colors and comfortable layers make this look ready for a day out.</p>",
    fashion_image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=900",
  },
  {
    style: "Kids Style",
    fashion_subject: "A comfortable look for every day",
    fashion_detail: "<p>Soft fabrics and easy shapes keep this outfit comfortable all day long.</p>",
    fashion_image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900",
  },
  {
    style: "STREET STYLE",
    fashion_subject: "Relaxed tailoring outside the show",
    fashion_detail: "<p>Relaxed tailoring brings a polished feel to the street-style wardrobe.</p>",
    fashion_image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
  },
];

async function seed() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const collection = client.db("FashionData").collection("Fashion");

    const [last] = await collection
      .find({ IdF: { $type: "number" } })
      .sort({ IdF: -1 })
      .limit(1)
      .toArray();
    let nextIdF = last ? last.IdF + 1 : 1;
    let inserted = 0;

    for (const [index, sample] of sampleFashions.entries()) {
      const exists = await collection.findOne({
        style: sample.style,
        fashion_subject: sample.fashion_subject,
      });
      if (exists) {
        continue;
      }
      await collection.insertOne({
        ...sample,
        IdF: nextIdF++,
        created_at: new Date(Date.now() - index * 60_000),
      });
      inserted++;
    }

    console.log(`Seed complete: inserted ${inserted} sample Fashion document(s).`);
  } finally {
    await client.close();
  }
}

seed().catch((error) => {
  console.error("Could not seed Fashion data:", error);
  process.exitCode = 1;
});
