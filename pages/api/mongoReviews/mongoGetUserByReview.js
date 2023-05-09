import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);

export default async function mongoGetUserByReview(req, res) {
  if (req.method === "POST") {
    const { username } = req.body;

    try {
      await client.connect(); // Await the connection to be established
      const db = client.db();
      const user = await db.collection("users").findOne({
        username: username,
      });

      if (user) {
        res.status(200).json(user); // Send the retrieved user as response
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
}