import { useEffect, useState, useRef } from "react";

import Image from "next/dist/client/image";
import { useSession } from "next-auth/react";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "../styles/radixAlertDialog.module.css";
import IMDbIcon from "../public/imdb.png";
import CommentSection from "./CommentSection";
import Like from "./like";
import { useRouter } from "next/router";
import { useIntersection } from "react-use";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  const { data: session, status } = useSession();
  const [followed, setFollowed] = useState(false);
  
  const router = useRouter();
  const intersectionRef = useRef(null);
  
  

 
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  const limit = 5;

  async function fetchReviews(page) {
    const response = await fetch(
      `/api/mongoReviews/mongoGetReview?limit=${limit}&page=${page}`
    );

    return response.json();
  }

  async function fetchFollowedReviews(page) {
    const response = await fetch(
      `/api/mongoReviews/mongoGetFollowedReview?sessionUser=${session.user.username}&limit=${limit}&page=${page}`
    );

    return response.json();
  }

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["reviews", followed],
      ({ pageParam = 1 }) =>
        !followed ? fetchReviews(pageParam) : fetchFollowedReviews(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          return lastPage.length === limit ? allPages.length + 1 : undefined;
        },
      }
    );

  useEffect(() => {
  
    
    if ( intersection && intersection.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  
    console.log(intersection, intersectionRef);
  }, [intersection, fetchNextPage, hasNextPage]);

 
  async function handleDeleteReview(_id){
    try {
      await deleteReview(_id);
      router.reload()

    } catch(err) {
      console.log(err)
    }
  }
 

  function formatLocalDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString(undefined, options);
  }

  async function handleSwitchFeed() {
    try {
      setFollowed((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div >
      <div className="flex container  justify-center">
        {!followed ? (
          <div className="flex flex-row justify-center bg-slate-700 rounded-lg border-2 border-slate-600">
            <button className="flex order-1 px-1 bg-slate-800 text-lg rounded-lg">
              Public
            </button>

            <button
              className="flex order-2 text-lg px-1 "
              onClick={() =>
                !session ? alert("Please sign in") : handleSwitchFeed()
              }
            >
              Followed
            </button>
          </div>
        ) : (
          <div className="flex flex-row justify-center bg-slate-700 rounded-lg border-2 border-slate-600">
            <button
              className="flex order-1 px-1  text-lg rounded-lg"
              onClick={() => handleSwitchFeed()}
            >
              Public
            </button>

            <button className="flex order-2 text-lg px-1 bg-slate-800 rounded-lg">
              Followed
            </button>
          </div>
        )}
      </div>

      <div>
        {isSuccess &&
          data.pages.map((page) =>
            page.map((review, index) => (
              <div key={index}>
                {
                  index === page.length - 1 && (
                    <div ref={intersectionRef} >HERE</div>
                  )}
                <div className="bg-slate-800 container rounded-lg flex flex-col h-2/5 w-full my-10 border-2 border-slate-700">
                  <div className="order-1  w-full h-12  rounded-t-lg   border-b-2 border-b-slate-700">
                    <div
                      className=" flex inset-x-0 top-0 justify-start float-left cursor-pointer"
                      onClick={() => router.push(`user/${review.user}`)}
                    >
                      {review.userImage ? (
                        <Image
                          alt="userImage"
                          src={review.userImage.image}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div> </div>
                      )}
                    </div>
                    <div
                      className="pl-2 flex cursor-pointer w-fit"
                      onClick={() => router.push(`user/${review.user}`)}
                    >
                      <h1 className="text-white font-semibold text-lg">
                        {review.user}
                      </h1>
                    </div>

                    <p className="text-gray-400  text-sm">
                      {formatLocalDate(review.createdAt)}
                    </p>
                  </div>

                  <div className="order-2 flex  h-3/4  overflow-clip">
                    <div id="main-left" className="flex w-1/3 ">
                      <Image
                        alt="movieImage"
                        src={review.movieData.Poster}
                        width="230"
                        height="350 "
                      ></Image>
                    </div>

                    <div
                      id="main-right"
                      className=" bg-slate-800 w-full md:w-2/3 border-l-2 border-slate-700 "
                    >
                      <div className="  flex justify-center  border-b-2 border-b-slate-700 cursor-pointer ">
                        <h1 className="text-white text-3xl md:text-2xl" onClick={() => router.push(`titles/${review.movieData.Title}`)}>
                          {review.movieData.Title}
                        </h1>
                      </div>

                      <div className="bg-slate-800 flex  justify-center  border-b-2 border-b-slate-700 ">
                        <div className="text-white  place-self-center md:text-sm">
                          {review.movieData.Year} || {review.movieData.Genre} ||
                        </div>
                        <div className="text-white place-self-center flex p-1 ">
                          <Image alt="IMDbLogo" src={IMDbIcon} />
                          {review.movieData.imdbRating}
                        </div>
                      </div>

                      <div className="bg-slate-900 h-5/6 flex flex-row container  border-b-2 border-b-slate-700">
                        <div className="absolute w-64 md:w-72 italic text-gray-500 text-xs  py-1 px-1 order-1 ">
                          <p></p>
                        </div>

                        <div className="self-center flex order-2 pl-1">
                          <h1 className="text-white text-3xl px-1 md:text-xl border-2 border-slate-700 rounded-lg">
                            {review.sliderRating}
                          </h1>
                        </div>

                        <div className=" self-center flex order-3 pl-8 md:pl-2">
                          <p className="text-white pl-2  text-sm w-72 md:h-44 md:text-xs md:w-48">
                            {review.textReview}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="order-3 w-full h-12 rounded-b-lg bg-green-500  border-t-2 border-t-slate-700">
                    <div className="flex flex-row w-full h-12 justify-around">
                      <div className="flex self-center">
                        <p>{!review.likes ? "0" : review.likes.length}</p>
                        <Like postId={review._id} reviewLikes={review.likes} />
                      </div>
                      <CommentSection postId={review._id} />
                      <p className="text-gray-400 self-center ">Share</p>

                      {session &&
                      (session.user.username === review.user.username ||
                        session.user.email === review.user.email ||
                        session.user.name === review.user.name) ? (
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
                                    <button onClick={()=> handleDeleteReview(review._id)} className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5">
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
          )}
        {isFetchingNextPage && (
          <p className="flex self-center text-white">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ReviewFeed;
