import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);

export default async function mongoGetComments(req, res) {
  if (req.method === "GET") {
    try {
      await client.connect(); // Await the connection to be established
      const db = client.db();

      // Get the postId from the request query or params
      const { postId } = req.query;

      // Fetch the specific post using the postId
      const post = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });

      if (post) {
        const comments = post.comments || []; // Get the comments array from the post
        res.status(200).json(comments); // Send the retrieved comments as response
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
}
