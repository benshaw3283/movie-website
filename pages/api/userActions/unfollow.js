import { MongoClient } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async function unFollow(req, res) {
  if (req.method === "PATCH") {
    const { username, follower } = req.body;

    try {
     const client =  await clientPromise
     await client.connect()
      const db = clientPromise.db();

      // Remove the follower from the followers array
      const result = await db
        .collection("users")
        .updateOne({ username: username }, { $pull: { followers: follower } });

      const result2 = await db
        .collection("users")
        .updateOne({ username: follower }, { $pull: { follows: username } });

      if (result.modifiedCount === 1 || result2.modifiedCount === 1) {
        res.status(200).json({ message: "Follower removed successfully" });
      } else {
        res
          .status(404)
          .json({ message: "Follower not found or already removed" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

