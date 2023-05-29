
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function mongoGetReviewHandler(req, res) {
  if (req.method === "GET") {
    try {
      const {limit, page} = req.query;
      const client = await connectToDatabase(); // Await the connection to be established
      const skip = (parseInt(page) - 1 ) * parseInt(limit);
      
      const reviews = await client
        .db()
        .collection("posts")
        .find({})
        .skip(skip)
        .limit(parseInt(limit))
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
