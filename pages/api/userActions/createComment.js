import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function createComment(req, res) {
  if (req.method === "PATCH") {
    const { postID, user, comment, postCreator } = req.body;
    const date = new Date();
    const isoDate = date.toISOString();

    try {
      const client = await connectToDatabase();

      const db = client.db();
      const commentID = new ObjectId();
      const postObjectID = new ObjectId(postID);

      const data = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: new ObjectId(postID) },
          { $addToSet: { comments: { user, comment, date, commentID } } },
          { returnDocument: "after" }
        );

      const notif = await db.collection("users").findOneAndUpdate(
        { username: postCreator },
        {
          $addToSet: {
            notifications: {
              user,
              postObjectID,
              seen: false,
              date: isoDate,
              comment,
              commentID,
            },
          },
        },
        { returnDocument: "after" }
      );
      console.log(notif);

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
