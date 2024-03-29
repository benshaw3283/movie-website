import React, { useEffect, useState } from "react";
import Image from 'next/image'

function Top() {
  const [topReviews, setTopReviews] = useState([]);

  useEffect(() => {
    // Fetch the reviews array
    fetch("/api/mongoReviews/mongoGetHighestReviews")
      .then((response) => response.json())
      .then((data) => {
        // Sort the reviews based on average sliderRating in descending order
        const sortedReviews = data.sort(
          (a, b) =>
            calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews)
        );

        // Get the top 3 reviews
        const top3Reviews = sortedReviews.slice(0, 3);

        // Set the topReviews state
        setTopReviews(top3Reviews);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  // Function to calculate the average sliderRating for a group of reviews
  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.sliderRating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating;
  };

  return (
    <div className="bg-black">
      <h1>Top 3 Reviews</h1>
      <ul>
        {topReviews.map((review, index) => (
          <li key={index}>
            
            <h1 className="text-xl">{review._id} </h1>
            <p className="text-sm">Average Rating: {calculateAverageRating(review.reviews)}</p>
            <Image alt='g' src={review.Poster}  height={150} width={100}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Top;
