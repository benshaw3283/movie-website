import { MongoClient } from "mongodb";


const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);


export default async function unFollow(req, res) {
    if (req.method === "PATCH") {
        const { username, follower } = req.body;
      
        try {
          await client.connect();
          const db = client.db();
          
          // Remove the follower from the followers array
          const result = await db.collection("users").updateOne(
            { username: username },
            { $pull: { followers: follower } }
          );
      
          if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Follower removed successfully" });
          } else {
            res.status(404).json({ message: "Follower not found or already removed" });
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
        }
      }
      
}

// Close the connection pool when the Node.js process exits
process.on("SIGINT", () => {
  client.close();
  process.exit();
});
