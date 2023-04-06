import { reviews } from "./reviewsArray";

export default function handler(req, res) {
  if (req.method === "GET") {
    const parsedReviews = reviews.map(review => JSON.parse(review)); // parse each JSON string back to an object
    // Return all reviews in the reviews array
    return res.status(200).json(parsedReviews);
  }

  // Handle other HTTP methods
  res.status(405).end();
}
