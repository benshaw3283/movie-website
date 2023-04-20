import { useEffect, useState } from "react";
//import { AvatarIcon } from "./RadixComponents";
import Image from "next/dist/client/image";

import Avatar from "../public/Avatar.jpg";

const ReviewFeed = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReview() {
      const response = await fetch("/api/mongoReviews/mongoGetReview");
      const data = await response.json();

      // Convert createdAt values to Date objects
      const reviewsWithDates = data.map((review) => ({
        ...review,
        createdAt: new Date(review.createdAt),
      }));

      // Sort reviews in reverse order based on createdAt
      const sortedReviews = reviewsWithDates.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      // Update reviews state by adding new reviews at the top and removing the oldest reviews if maxlength is reached
      setReviews(() => {
        const updatedReviews = [...sortedReviews];
        const maxLength = 3; // set the maximum length of reviews
        if (updatedReviews.length > maxLength) {
          updatedReviews.pop(); // remove the oldest review
        }
        return updatedReviews;
      });
    }
    fetchReview();
  }, []);
  console.log(reviews);
  const formatLocalDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {reviews.length ? (
        reviews.map((review, index) => (
          <div key={index}>
            <div className="bg-neutral-50 container rounded-lg flex flex-col h-2/5 w-full ">
              <div className="order-1  w-100% h-12 rounded-t-lg  bg-green-400">
                <div className="text-red-400 flex inset-x-0 top-0 justify-start float-left">
                  <h1>Avatar</h1>
                </div>
                <h1 className="text-black">{review.user}</h1>
                <p className="text-blue-400 px-16">
                  {formatLocalDate(review.createdAt)}
                </p>
              </div>
              <div className="order-2 flex w-full h-3/4  overflow-clip">
                <div id="main-left" className="flex w-2/3">
                  <Image alt="Avatar" src={Avatar}></Image>
                </div>
                <div id="main-right" className=" bg-black w-full">
                  <div className=" bg-blue-400 flex justify-center">
                    <h1 className="text-black text-2xl">{review.movieTitle}</h1>
                  </div>
                  <div className="bg-white flex justify-start">
                    <h2 className="text-gray-500">
                      Release Date || Genre || IMDB rating
                    </h2>
                  </div>

                  <div className="bg-black h-5/6 flex flex-row">
                    <div className="self-center order-1">
                      <h1 className="text-white text-3xl pl-2 ">
                        {review.sliderRating}
                      </h1>
                    </div>

                    <div className="self-center order-2 pl-10">
                      <p className="text-white ">TEXT REVIEW</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-3 w-full h-12 rounded-b-lg bg-red-500">
                <div className="flex flex-row w-full h-12 justify-around">
                  <p className="text-black self-center">Like</p>
                  <p className="text-black self-center">Comment</p>
                  <p className="text-black self-center">Share</p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-slate-900 container rounded-lg flex justify-center h-2/5 w-full ">
          <div className="justify-center ">
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <p>Loading reviews...</p>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFeed;
