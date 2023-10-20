import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function like(req, res) {
  if (req.method === "PATCH") {
    const { user, id, poster } = req.body;
    const datE = new Date();
    const date = datE.toISOString();

    try {
      const client = await connectToDatabase();

      const db = client.db();

      const data = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $addToSet: { likes: user } },
          { returnDocument: "after" }
        );

      const data2 = await db.collection("users").findOneAndUpdate(
        { username: poster },
        {
          $addToSet: {
            notifications: {
              user,
              seen: false,
              date,
              postObjectID: new ObjectId(id),
            },
          },
        }
      );
      res.status(201).json({ message: "Liked!", ...data, ...data2 });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({
        message: "Internal server error - Unable to like review",
      });
    }
  }
}
