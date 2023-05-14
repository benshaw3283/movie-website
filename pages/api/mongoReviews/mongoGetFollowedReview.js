import { MongoClient } from "mongodb";
import clientPromise from "../../../lib/mongodb";



export default async function mongoGetFollowedReviewHandler(req, res) {
  if (req.method === "GET") {
    const { sessionUser } = req.query;
    try {
      const client = await clientPromise
      await client.connect()
      const db = client.db();

      const user = await db.collection("users").findOne({
        username: sessionUser,
      });

      let followedUsers = user.follows || [];

      const reviews = await db
        .collection("posts")
        .find({
          user: { $in: followedUsers },
        })
        .toArray(); // Fetch all reviews from the database
      res.status(200).json(reviews); // Send the retrieved reviews as response
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
}
