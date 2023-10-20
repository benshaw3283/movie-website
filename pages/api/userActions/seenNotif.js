import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function seenNotif(req, res) {
  if (req.method === "PATCH") {
    const { user, commentID } = req.body;

    try {
      const client = await connectToDatabase();

      const db = client.db();

      const data = await db.collection("users").findOneAndUpdate(
        { username: user, "notifications.commentID": new ObjectId(commentID) },
        {
          $set: {
            "notifications.$.seen": true,
          },
        }
      );

      res.status(201).json({ message: "Comment seen!", data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const { postID } = req.query;
      const client = await connectToDatabase(); // Await the connection to be established
      const postObjectID = new ObjectId(postID);
      const review = await client
        .db()
        .collection("posts")
        .findOne({ _id: postObjectID });

      res.status(200).json(review); // Send the retrieved reviews as response
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
