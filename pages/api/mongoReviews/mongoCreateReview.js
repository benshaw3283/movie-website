import { MongoClient } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";


export default async function mongoCreateReview(req, res) {
  if (req.method === "POST") {
    const { sliderRating, user, movieData, textReview, userImage } = req.body;
    // Check if the required fields are present
    if ( !sliderRating) {
      res.status(400).json({ message: "Missing required fields" });

      return;
    }
    try {
     const client =  await connectToDatabase()
    
      const db = client.db();

      const data = await db.collection("posts").insertOne({
        user: user,
        sliderRating: sliderRating,
        createdAt: new Date(),
        movieData: movieData,
        textReview: textReview,
        userImage : userImage
      });
      res.status(201).json({ message: "Review created!", ...data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

