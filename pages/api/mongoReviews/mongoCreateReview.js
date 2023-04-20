import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create a connection pool
const client = new MongoClient(uri, options);
client.connect();

export default async function mongoCreateReview(req, res) {
  if (req.method === "POST") {
    const { movieTitle, sliderRating, user } = req.body;
    // Check if the required fields are present
    if (!movieTitle || !sliderRating) {
         res.status(400).json({ message: "Missing required fields" });
      
    return;
    }
  try {
    const db = client.db();
    

    const data = await db.collection("posts").insertOne({
      movieTitle: movieTitle,
      sliderRating: sliderRating,
      createdAt: new Date().toLocaleDateString(),
      user: user
      
    });
    res.status(201).json({ message: "Review created!", ...data });
  } catch (err) {
    // Log the error and return an error response
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
}

// Close the connection pool when the Node.js process exits
process.on("SIGINT", () => {
  client.close();
  process.exit();
});
