import { MongoClient } from "mongodb";
import { mongoose } from "mongoose";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);
client.connect();

export default async function mongoDeleteReview(req, res) {
  
    try {
      const db = client.db();

      const data = await db.collection("posts").deleteOne({
       _id : '6444a50c5946ecaa5ef9a783'
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


// Close the connection pool when the Node.js process exits
process.on("SIGINT", () => {
  client.close();
  process.exit();
});
