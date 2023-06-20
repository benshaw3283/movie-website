import { useEffect, useState, useRef } from "react";

import Image from "next/dist/client/image";
import { useSession } from "next-auth/react";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "../styles/radixAlertDialog.module.css";
import IMDbIcon from "../public/imdb.png";
import CommentSection from "./CommentSection";
import Like from "./LikeComponent";
import { useRouter } from "next/router";
import { useIntersection } from "react-use";
import { useInfiniteQuery } from "@tanstack/react-query";
import FadeLoader from "react-spinners/FadeLoader";

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
  const { data: session } = useSession();
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false)

  const router = useRouter();
  const intersectionRef = useRef(null);

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

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  if (intersection && intersection.isIntersecting && hasNextPage) {
    fetchNextPage();
  }

  async function handleDeleteReview(_id) {
    try {
      await deleteReview(_id);
      router.reload();
    } catch (err) {
      console.log(err);
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
    <div>
      <div className=" sticky top-20 left-1/2 lg:pl-64">
      <FadeLoader color='blue' loading={loading} aria-label="loading" 
      />
      </div>
      
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
                <div className="bg-slate-800 container rounded-lg flex flex-col h-2/5 w-full  my-10 border-2 border-slate-700">
                  <div className="order-1  w-full h-12  rounded-t-lg   border-b-2 border-b-slate-700">
                    <div className="flex flex-row ">
                      <div className="flex order-1 w-full">
                        <div
                          className=" flex inset-x-0 top-0 justify-start float-left cursor-pointer"
                          onClick={() => setLoading(!loading) & router.push(`user/${review.user}`)}
                        >
                          {review.userImage ? (
                            <Image
                              alt="userImage"
                              src={review.userImage.image}
                              width={45}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div> </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div
                            className="pl-2 flex cursor-pointer w-fit order-1"
                            onClick={() => setLoading(!loading) & router.push(`user/${review.user}`)}
                          >
                            <h1 className="text-white font-semibold text-lg">
                              {review.user}
                            </h1>
                          </div>
                          <div className="flex order-2">
                            <p className="text-gray-400  text-sm">
                              {formatLocalDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex order-2 place-items-end justify-end">
                        <p className="flex p-1 text-slate-500">
                          {review.movieData.Type === "movie" ? "Movie" : "TV"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="order-2 flex w-full h-5/6  overflow-clip">
                    <div id="main-left" className="flex lg:w-1/3  ">
                      <Image
                        alt="movieImage"
                        src={review.movieData.Poster}
                        width={230}
                        height={320}
                       
                      ></Image>
                    </div>

                    <div
                      id="main-right"
                      className=" bg-slate-800 w-full lg:w-2/3 md:w-2/3 sm:w-2/3 border-l-2 border-slate-700 "
                    >
                      <div className=" flex justify-center  border-b-2 border-b-slate-700 cursor-pointer ">
                        {review.movieData.Title.length <= 22 ? (
                          <h1
                            className="text-white lg:text-3xl md:text-2xl text-lg font-semibold "
                            onClick={() =>
                            setLoading(!loading) &  router.push(`titles/${review.movieData.Title}`)
                            }
                          >
                            {review.movieData.Title}
                          </h1>
                        ) : (
                          <h1
                            className="text-white lg:text-2xl md:text-xl text-basefont-semibold "
                            onClick={() =>
                              setLoading(!loading) & router.push(`titles/${review.movieData.Title}`)
                            }
                          >
                            {review.movieData.Title}
                          </h1>
                        )}
                      </div>

                      <div className="bg-slate-800 flex  justify-center  border-b-2 border-b-slate-700 ">
                        <div className=" flex place-self-center md:text-sm place-items-center ">
                         <p className="text-white pr-1 font-semibold lg:text-lg ">{review.movieData.Year}</p>  <p className="text-slate-500 text-xs lg:text-lg px-2 flex">{review.movieData.Genre} </p> 
                        </div>
                        <div className="text-white place-self-center  lg:flex p-1 ">
                          <Image alt="IMDbLogo" src={IMDbIcon} />
                         <p className="pl-1 font-semibold">{review.movieData.imdbRating}</p> 
                        </div>
                      </div>

                      {review.textReview !== "" ? (
                        <div className="bg-slate-900 h-5/6 flex flex-col container lg:justify-center border-b-2 border-b-slate-700 pt-1">
                          <div className="self-center flex order-1 ">
                            <h1 className="text-white lg:text-3xl px-1 md:text-xl border-2 border-slate-700 rounded-lg font-semibold">
                              {review.sliderRating}
                            </h1>
                          </div>
                          <div className=" self-center flex order-2 ">
                            <p className="text-white pl-2 mt-1 lg:text-sm text-xs lg:w-72 md:h-44 md:text-xs md:w-48 h-28">
                              {review.textReview}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-900 h-5/6 flex flex-col lg:justify-center  border-b-2 border-b-slate-700 pt-1">
                          <div className="self-center flex order-1 ">
                            {review.sliderRating !== 100 ? (
                            <h1 className="text-white lg:text-3xl px-1 md:text-xl border-2 border-slate-700 rounded-lg font-semibold">
                              {review.sliderRating}
                            </h1>
                            ) : (
                              <h1 className="text-amber-400 lg:text-3xl px-1 md:text-xl border-2 border-slate-700 rounded-lg font-semibold">
                              {review.sliderRating}
                            </h1>
                            )}
                          </div>

                          <div className="place-self-center  flex order-2 mt-2">
                            <p className="text-gray-500 pl-2  lg:text-sm lg:w-72 md:h-44 md:text-xs md:w-48 text-xs">
                              {review.movieData.Plot}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="order-3 w-full h-12 rounded-b-lg bg-slate-800  border-t-2 border-t-slate-700">
                    <div className="flex flex-row w-full h-12 justify-around">
                      <div className="flex self-center">
                        <Like
                          postId={review._id}
                          reviewLikes={review.likes}
                          likes={review.likes}
                        />
                      </div>
                      <CommentSection postId={review._id} />
                      <p className="text-gray-400 self-center ">Share</p>

                      {session &&
                      (session.user.name === review.user ||
                        session.user.email === review.user ||
                        session.user.username === review.user) ? (
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
                                      onClick={() =>
                                        setLoading(!loading) &  handleDeleteReview(review._id)
                                      }
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
          )}
        {isFetchingNextPage && (
          <p className="flex self-center text-white">Loading...</p>
        )}
      </div>
      <div ref={intersectionRef}></div>
    </div>
  );
};

export default ReviewFeed;
