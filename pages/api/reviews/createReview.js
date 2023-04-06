
import { reviews } from "./reviewsArray";

export default function createReview(req, res) {
  try {
    const { movieTitle, sliderRating } = req.body;

    // Check if the required fields are present
    if (!movieTitle || !sliderRating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new review object and add it to the reviews array
    const review = {
      movieTitle,
      sliderRating,
      createdAt: new Date(),
    };
    reviews.push(JSON.stringify(review));


    // Send the new review object as the response
    return res.status(201).json(review);
  } catch (err) {
    // Log the error and return an error response
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
