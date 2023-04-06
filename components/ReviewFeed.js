import { useEffect, useState } from "react";

const ReviewFeed = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReview() {
      const response = await fetch("/api/reviews/getReview");
      const data = await response.json();
      setReviews(data);
      
    }
    fetchReview();
  }, []);

    console.log(reviews)
    return (
        <div>
          {reviews.length ? (
            reviews.map((review, index) => (
              <div key={index}>
                <h2>Review</h2>
                <p>Movie Title: {review.movieTitle}</p>
                <p>Slider Rating: {review.sliderRating}</p>
                <p>Created At: {new Date(review.createdAt).toString()}</p>
              </div>
            ))
          ) : (
            <p>Loading reviews...</p>
          )}
        </div>
      );
    };

export default ReviewFeed;
