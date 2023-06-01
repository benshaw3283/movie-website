import React, { useEffect, useState } from "react";
import Image from 'next/image'

function TopMovies() {
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
    return averageRating.toFixed(1);
  };

  return (
    <div className=" w-fit  p-2">
      <h1 className="text-xl">Highest Rated Movies</h1>
      <br></br>
      <ul>
        {topReviews.map((review, index) => (
          <li key={index} className=" mt-2 rounded-lg flex flex-col items-center">
            
            <h1 className="text-xl text-white">{review._id} </h1>
            <p className="text-sm ">Average Rating: {calculateAverageRating(review.reviews)}</p>
            <div className="">
            <Image alt='g' src={review.Poster}  height={175} width={125}/>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopMovies;
