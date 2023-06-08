import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from "next/router";

function TopMovies() {
  const [topReviews, setTopReviews] = useState([]);
  const router = useRouter();
  const [open, setOpen] = useState(true)

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

  const handleOpen = () => {
    setOpen(!open)
  }

  // Function to calculate the average sliderRating for a group of reviews
  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.sliderRating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating.toFixed(1);
  };

  return (
    <div className=" w-fit  p-2">
      <h1 className="text-xl flex justify-center">Top Rated</h1>
      
      {open ? (
        <div>
      <div className="flex justify-center" onClick={()=> handleOpen()}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
</svg>
</div>
      <ul>
        {topReviews.map((review, index) => (
          <li key={index} className=" mt-2  flex flex-col items-center cursor-pointer" onClick={() => router.push(`../titles/${review._id}`)}>
            <div className="border-2 border-slate-800 p-1 rounded-lg ">
            <h1 className="text-xl text-white flex justify-center">{review._id} </h1>
            <p className="text-sm " >Average Rating: {calculateAverageRating(review.reviews)}</p>
            <div className="flex justify-center">
            <Image alt='g' src={review.Poster}  height={175} width={125}/>
            </div>
            </div>
          </li>
        ))}
      </ul>
      </div>
      ) : (
        <div className="flex justify-center" onClick={()=> handleOpen()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>

        </div>
      )}
    </div>
  );
}

export default TopMovies;
