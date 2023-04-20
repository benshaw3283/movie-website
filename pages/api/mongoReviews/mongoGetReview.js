import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);

export default async function mongoGetReviewHandler(req, res) {
  if (req.method === "GET") {
    try {
      await client.connect(); // Await the connection to be established
      const db = client.db();
      const reviews = await db.collection("posts").find({}).toArray(); // Fetch all reviews from the database
      res.status(200).json(reviews); // Send the retrieved reviews as response
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
}
