import { MongoClient } from "mongodb";
import clientPromise from "../../../lib/mongodb";


export default async function editBio(req, res) {
  if (req.method === "PATCH") {
    const { username, bio } = req.body;

    try {
     const client =  await clientPromise;
     await client.connect()
      const db = client.db();

      const data = await db.collection("users").findOneAndUpdate(
        { username: username },
        { $set: { bio: bio } }, 
        { returnDocument: "after" }
      );
      res.status(201).json({ message: "Bio changed!", ...data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res
        .status(500)
        .json({
          message: "Internal server error - Unable to edit bio",
        });
    }
  }
}
