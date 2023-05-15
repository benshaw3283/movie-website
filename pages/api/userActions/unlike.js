import { MongoClient, ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function unFollow(req, res) {
  if (req.method === "PATCH") {
    const { user, id } = req.body;

    try {
     const client = await connectToDatabase()
     
      const db = client.db();

      // Remove the follower from the followers array
      const result = await db
        .collection("posts")
        .updateOne({ _id: new ObjectId(id) }, { $pull: { likes: user } });

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Unliked successfully" });
      } else {
        res.status(404).json({ message: "Like not found or already removed" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
