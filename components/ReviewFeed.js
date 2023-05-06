import { useEffect, useState, useRef } from "react";
//import { AvatarIcon } from "./RadixComponents";
import Image from "next/dist/client/image";
import { useSession } from "next-auth/react";
import Avatar from "../public/Avatar.jpg";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "../styles/radixAlertDialog.module.css";
import IMDbIcon from "../public/imdb.png";

async function deleteReview(_id) {
  const response = await fetch("/api/mongoReviews/mongoDeleteReview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _id: _id,
    }),
  });
  return response;
}

const ReviewFeed = () => {
  const [reviews, setReviews] = useState([]);
  const { data: session, status } = useSession();

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

      setReviews(() => {
        const maxLength = 30;
        const updatedReviews = [...sortedReviews];

        if (updatedReviews.length > maxLength) {
          updatedReviews.splice(maxLength, Infinity);
        }
        return updatedReviews;
      });
    }

  

    fetchReview();
  }, []);

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

  async function handleDeleteReview(_id) {
    try {
      await deleteReview(_id);
      // After deleting the review, update the reviews state to remove the deleted review
      setReviews(reviews.filter((review) => review._id !== _id));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      {reviews.length ? (
        reviews.map((review, index) => (
          <div key={index}>
            <div className="bg-slate-800 container rounded-lg flex flex-col h-2/5 w-full my-10 border-2 border-slate-700">
              <div className="order-1  w-100% h-12 rounded-t-lg  bg-green-400 border-b-2 border-b-slate-700">
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
                  <Image
                    alt="movieImage"
                    src={review.movieData.Poster}
                    width="230"
                    height="350"
                  ></Image>
                </div>
                
                <div id="main-right" className=" bg-black w-full">
                
                        
                  <div className=" bg-blue-400 flex justify-center  border-b-2 border-b-slate-700">
                    <h1 className="text-black text-2xl">
                      
                      {review.movieData.Title}
                      
                    </h1>
                  </div>
                        
                  <div className="bg-white flex  justify-center  border-b-2 border-b-slate-700">
                    <div className="text-gray-500  ">
                      {review.movieData.Year} || {review.movieData.Genre} ||
                    </div>
                    <div className="text-gray-500 ">
                      <Image alt="IMDbLogo" src={IMDbIcon} />
                      {review.movieData.imdbRating}
                    </div>
                  </div>

                  <div className="bg-black h-5/6 flex flex-row container  border-b-2 border-b-slate-700">
                    <div className="absolute w-64 italic text-gray-500 text-xs py-1 px-1 order-1"><p>{review.movieData.Plot}</p> </div>
                   
                    <div className="self-center flex order-2 ">
                      <h1 className="text-white text-3xl pl-4 ">
                        {review.sliderRating}
                      </h1>
                    </div>
                    
                    
                    
                    <div className=" self-center flex order-3 pl-8">
                      <p className="text-white pl-2 pt-6 text-sm w-72">{review.textReview}</p>
                      
                      
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-3 w-full h-12 rounded-b-lg bg-red-500  border-t-2 border-t-slate-700">
                <div className="flex flex-row w-full h-12 justify-around">
                  <p className="text-black self-center cursor-pointer">Like</p>
                  <p className="text-black self-center cursor-pointer">
                    Comment
                  </p>
                  <p className="text-black self-center cursor-pointer">Share</p>

                  {session &&
                  (session.user.username === review.user ||
                    session.user.email === review.user ||
                    session.user.name === review.user) ? (
                    <div className="self-center cursor-pointer">
                      <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 "
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </AlertDialog.Trigger>
                        <AlertDialog.Portal>
                          <AlertDialog.Overlay
                            className={styles.AlertDialogOverlay}
                          />
                          <AlertDialog.Content
                            className={styles.AlertDialogContent}
                          >
                            <AlertDialog.Title
                              className={styles.AlertDialogTitle}
                            >
                              Are you sure?
                            </AlertDialog.Title>
                            <AlertDialog.Description
                              className={styles.AlertDialogDescription}
                            >
                              This action cannot be undone. This will
                              permanently delete your review.
                            </AlertDialog.Description>
                            <div
                              style={{
                                display: "flex",
                                gap: 25,
                                justifyContent: "flex-end",
                              }}
                            >
                              <AlertDialog.Cancel asChild>
                                <button
                                  type="button"
                                  className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5"
                                >
                                  Cancel
                                </button>
                              </AlertDialog.Cancel>
                              <AlertDialog.Action asChild>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5"
                                >
                                  Yes, delete review
                                </button>
                              </AlertDialog.Action>
                            </div>
                          </AlertDialog.Content>
                        </AlertDialog.Portal>
                      </AlertDialog.Root>
                    </div>
                  ) : (
                    <div> </div>
                  )}
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
            <br></br>
            <br></br>
            <br></br>
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
