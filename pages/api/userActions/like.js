import { MongoClient, ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function like(req, res) {
  if (req.method === "PATCH") {
    const { user, id } = req.body;

    try {
       const client =  await connectToDatabase()
      
      const db = client.db();

      const data = await db.collection("posts").findOneAndUpdate(
        { _id : new ObjectId(id) },
        { $addToSet: { likes: user } }, 
        { returnDocument: "after" }
      );
      res.status(201).json({ message: "Liked!", ...data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res
        .status(500)
        .json({
          message: "Internal server error - Unable to like review",
        });
    }
  }
}

