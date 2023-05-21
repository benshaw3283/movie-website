import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function updateUserAvatar(req, res) {
  if (req.method === "PATCH") {
    const { username, avatar64 } = req.body;

    try {
      const client = await connectToDatabase();

      const db = client.db();

      const data = await db
        .collection("users")
        .findOneAndUpdate(
          { username: username },
          { $set: { image: avatar64 } }
        );
      res.status(201).json({ message: "User Avatar updated!", ...data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({
        message: "Internal server error - Unable to update user avatar",
      });
    }
  }
}
