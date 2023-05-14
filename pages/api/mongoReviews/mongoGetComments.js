import { MongoClient, ObjectId } from "mongodb";

import clientPromise from "../../../lib/mongodb";


export default async function mongoGetComments(req, res) {
  if (req.method === "GET") {
    try {
     const client =  await clientPromise;
     await client.connect()
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