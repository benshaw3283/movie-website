import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";



export default async function mongoDeleteReview(req, res) {
  if (req.method === "POST") {
    const { _id } = req.body;

    try {
      const client = await connectToDatabase()
      
      const db = client.db();

      const data = await db.collection("posts").deleteOne({
        
       _id : new ObjectId(_id)
        
    });
      res.status(201).json({ message: "Review deleted!", ...data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res
        .status(500)
        .json({ message: "Internal server error - Unable to delete review" });
    }
  }
}

