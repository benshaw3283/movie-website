import { MongoClient } from "mongodb";

import clientPromise from "../../../lib/mongodb";



export default async function mongoGetReviewHandler(req, res) {
  if (req.method === "GET") {
    try {
     const client =  await clientPromise; // Await the connection to be established
      await client.connect()
      const reviews = await client.db().collection("posts").find({}).toArray() ; // Fetch all reviews from the database
      res.status(200).json(reviews); // Send the retrieved reviews as response
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
  
}
