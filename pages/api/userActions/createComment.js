import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function createComment(req, res) {
  if (req.method === "PATCH") {
    const { id, user, comment, postCreator } = req.body;
    const date = new Date();

    try {
      const client = await connectToDatabase();

      const db = client.db();

      const data = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $addToSet: { comments: { user, comment, date } } },
          { returnDocument: "after" }
        );

      const notif = await db
        .collection("users")
        .findOneAndUpdate(
          { username: postCreator },
          {
            $addToSet: {
              notifications: { user, id, seen: false, date, comment },
            },
          },
          { returnDocument: "after" }
        );

      res.status(201).json({ message: "Comment created!", ...data, ...notif });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({
        message: "Internal server error - Unable to create comment",
      });
    }
  }
}
