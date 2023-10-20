import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function deleteComment(req, res) {
  if (req.method === "PATCH") {
    const { postID, commentID } = req.body;

    try {
      const client = await connectToDatabase();

      const db = client.db();

      const result = await db.collection("posts").updateOne(
        { _id: new ObjectId(postID) },
        {
          $pull: {
            comments: { commentID: new ObjectId(commentID) },
          },
        }
      );
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Comment not found." });
      }

      res.status(204).end(); // No content, successful deletion
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({
        message: "Internal server error - Unable to delete comment",
      });
    }
  }
}
