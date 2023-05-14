import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);
client.connect();

export default async function updateUserAvatar(req, res) {
  if (req.method === "PATCH") {
    const { username, avatar64 } = req.body;

    try {
      const db = client.db();

      const data = await db
        .collection("users")
        .findOneAndUpdate(
          { username: username },
          { $set: { avatar: avatar64 }}
        );
      res.status(201).json({ message: "User Avatar updated!", ...data });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res
        .status(500)
        .json({
          message: "Internal server error - Unable to update user avatar",
        });
    }
  }
}
