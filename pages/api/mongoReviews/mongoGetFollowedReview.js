import { MongoClient } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function mongoGetFollowedReviewHandler(req, res) {
  if (req.method === "GET") {
    const { sessionUser, limit, page } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    try {
      const client = await connectToDatabase();

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
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .skip(skip) // Skip the specified number of documents
        .limit(parseInt(limit)) // Limit the number of documents returned

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
