import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);
client.connect();

export default async function createComment(req, res) {
  if (req.method === "PATCH") {
    const { id, user, comment } = req.body;

    try {
      const db = client.db();

      const data = await db
        .collection("posts")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $addToSet: { comments: { user, comment } } },
          { returnDocument: "after" }
        );
        
      res.status(201).json({ message: "Comment created!", ...data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({
        message: "Internal server error - Unable to create comment",
      });
    }
  }
}

