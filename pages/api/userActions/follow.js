import { MongoClient } from "mongodb";
import clientPromise from "../../../lib/mongodb";



export default async function addFollower(req, res) {
  if (req.method === "PATCH") {
    const { username, follower } = req.body;

    try {
     const client =  await clientPromise
     await client.connect()
      const db = clientPromise.db();

      const data = await db.collection("users").findOneAndUpdate(
        { username: username },
        { $addToSet: { followers: follower } }, // Use $addToSet to add the user to the followers array
        { returnDocument: "after" }
      );

      const data2 = await db.collection("users").findOneAndUpdate(
        { username: follower },
        { $addToSet: { follows: username } }, // Use $addToSet to add the user to the followers array
        { returnDocument: "after" }
      );
      res.status(201).json({ message: "Follower added!", ...data, ...data2});
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res
        .status(500)
        .json({
          message: "Internal server error - Unable to add follower",
        });
    }
  }
}

