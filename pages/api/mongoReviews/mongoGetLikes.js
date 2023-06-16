import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";


export default async function mongoGetLikes(req, res) {
  if (req.method === "GET") {
    try {
     const client =  await connectToDatabase();
     
      const db = client.db();

      // Get the postId from the request query or params
      const { postId } = req.query;

      // Fetch the specific post using the postId
      const post = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });

      if (post) {
        let likes = post.likes || []; // Get the likes array from the post
        res.status(200).json(likes); // Send the retrieved likes as response
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
