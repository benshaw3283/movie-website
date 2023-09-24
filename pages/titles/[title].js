import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/dist/client/image";
import styles from "/styles/radixAlertDialog.module.css";
import Link from "next/link";

import CommentSection from "../../components/CommentSection";
import Like from "../../components/LikeComponent";
import connectToDatabase from "../../lib/connectToDatabase";

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

export async function getServerSideProps(context) {
  const { title } = context.query;

  const client = await connectToDatabase();

  let url = `http://www.omdbapi.com/?apikey=4f46879e&r=json&t=${title}`;
  const options = {
    method: "GET",
  };

  if (title === "Oppenheimer" || title === "oppenheimer") {
    url = `https://www.omdbapi.com/?apikey=4f46879e&r=json&t=Oppenheimer&y=2023`;
  }

  const value = await fetch(url, options);
  const response = await value.json();
  const values = JSON.parse(JSON.stringify(response));

  // Fetch user's posts
  const data = await client
    .db()
    .collection("posts")
    .find({ "movieData.Title": title })
    .toArray();

  const posts = JSON.parse(JSON.stringify(data));

  const sliderRatings = posts.map((post) => post.sliderRating);
  const averageRating = (
    sliderRatings.reduce((total, rating) => total + rating, 0) /
    sliderRatings.length
  ).toFixed(1);

  return { props: { posts, averageRating, values } };
}

const Title = ({ posts, values, averageRating }) => {
  const [reviews, setReviews] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function postsHandler() {
      const mapPosts = posts.map((post) => ({
        ...post,
        createdAt: new Date(post.createdAt),
      }));

      // Sort reviews in reverse order based on createdAt
      const sortedReviews = mapPosts.sort((a, b) => b.createdAt - a.createdAt);
      setReviews(() => {
        const updatedReviews = [...sortedReviews];
        return updatedReviews;
      });
    }

    postsHandler();
  }, [posts, values]);

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
      <div className="bg-slate-900  w-full h-full min-h-screen">
        <div className="flex flex-col items-center w-full h-full">
          <div className="order-1 ">
            <br></br>
          </div>
          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center  flex lg:w-1/2 w-11/12 lg:h-1/3 order-2 overflow-clip  min-h-fit pb-1 lg:pb-0">
            <div className="lg:w-fit w-0 h-0 lg:h-fit absolute lg:relative ">
              <Image
                src={values.Poster}
                alt="f"
                width={385}
                height={320}
                className="float-left  invisible lg:visible lg:relative "
              />
            </div>
            <div className="flex flex-col container justify-around lg:justify-between py-2 pt-4 lg:pt-2 h-fit px-1">
              <div className="order-1 place-self-center bg-slate-800 lg:fit  w-fit rounded-lg border-2 border-slate-700 py-2 px-2 ">
                {values.Title.length > 14 ? (
                  <h1 className="text-white font-bold font-mono lg:text-2xl text-lg ">
                    {values.Title}
                  </h1>
                ) : (
                  <h1 className="text-white font-bold font-mono lg:text-5xl text-2xl">
                    {values.Title}
                  </h1>
                )}
              </div>

              <div className="flex  order-2 py-4 ">
                <div className="flex flex-row justify-around container px-2 pb-3 lg:pb-0">
                  <div className="flex flex-col">
                    <div className="order-1 ">
                      <h2 className="px-2 lg:text-lg  flex font-semibold">
                        Runtime
                      </h2>
                    </div>
                    <div className="order-2 flex place-self-center">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 lg:text-lg text-white">
                        {values.Runtime}
                      </p>
                    </div>
                  </div>

                  <div className="flex p-2 flex-col ">
                    <h2 className="px-2 lg:text-xl font-semibold justify-center flex">
                      {values.Director !== "N/A" ? `Director` : `Writer`}
                    </h2>
                    <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 lg:px-2 px-1 lg:text-xl text-sm text-white">
                      {values.Director !== "N/A"
                        ? `${values.Director}`
                        : `${values.Writer}`}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className="order-1 place-self-center flex">
                      <h2 className="px-2 lg:text-lg font-semibold">
                        Box Office
                      </h2>
                    </div>
                    <div className="order-2 flex place-self-center">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 lg:text-lg text-white">
                        {values.BoxOffice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-3 pl-4 flex ">
                <div className="flex flex-row justify-around container px-2 ">
                  <div className="flex flex-col ">
                    <div className="order-1 place-self-center flex ">
                      <h2 className="px-2  text-lg font-semibold">Actors</h2>
                    </div>
                    <div className="order-2 ">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 text-sm lg:text-base text-white">
                        {values.Actors}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-4  lg:flex    justify-around flex ">
                <div className="flex flex-row justify-between container place-items-center">
                  <div className="flex flex-col pt-2 order-1">
                    <div className="order-1 place-self-center flex ">
                      <h2 className="px-2 lg:text-lg font-semibold">Rated</h2>
                    </div>
                    <div className="order-2 flex place-self-center">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 lg:text-lg text-base text-white">
                        {values.Rated}
                      </p>
                    </div>
                  </div>

                  <div className="flex place-self-center flex-col lg:visible  order-2 place-items-center mt-6">
                    <h2 className=" lg:text-lg flex font-semibold ">Reviews</h2>
                    <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 lg:text-lg w-fit text-white">
                      {reviews.length}
                    </p>
                  </div>

                  <div className="flex flex-col pt-2 order-3">
                    <div className="order-1 place-self-center flex ">
                      <h2 className=" lg:text-lg font-semibold">
                        Average Rating
                      </h2>
                    </div>
                    <div className="order-2 flex place-self-center ">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 lg:text-lg text-white">
                        {averageRating !== "NaN" ? averageRating : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex order-3">
            <br></br>
          </div>
          <div className="bg-slate-900 border-4 border-double border-slate-700 rounded-lg container grid lg:grid-cols-2 grid-cols-1 w-full h-full order-4 py-2 ">
            <h1 className="absolute justify-self-center font-semibold text-slate-500 text-xl">
              REVIEWS
            </h1>
            {reviews.length ? (
              reviews.map((review, index) => (
                <div key={index} className="">
                  <div className=" w-full  px-4  flex justify-center">
                    <div className="bg-slate-800 container rounded-lg flex flex-col h-2/5 lg:w-5/6 w-full  my-10 border-2 border-slate-700">
                      <div className="order-1  w-full h-12  rounded-t-lg   border-b-2 border-b-slate-700">
                        <div className="flex flex-row ">
                          <div className="flex order-1 w-full">
                            <div
                              className=" flex inset-x-0 top-0 justify-start float-left cursor-pointer"
                              onClick={() =>
                                !session
                                  ? alert("Please sign in")
                                  : router.push(`../user/${review.user}`)
                              }
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
                                onClick={() =>
                                  !session
                                    ? alert("Please sign in")
                                    : router.push(`../user/${review.user}`)
                                }
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
                              {review.movieData.Type === "movie"
                                ? "Movie"
                                : "TV"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="order-2 flex w-full h-5/6  overflow-clip">
                        <div id="main-left" className="flex lg:w-2/5 ">
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
                                  setLoading(!loading) &
                                  router.push(
                                    `../titles/${review.movieData.Title}`
                                  )
                                }
                              >
                                {review.movieData.Title}
                              </h1>
                            ) : (
                              <h1
                                className="text-white lg:text-2xl md:text-xl text-base font-semibold"
                                onClick={() =>
                                  setLoading(!loading) &
                                  router.push(
                                    `../titles/${review.movieData.Title}`
                                  )
                                }
                              >
                                {review.movieData.Title}
                              </h1>
                            )}
                          </div>

                          <div className="bg-slate-800 flex  justify-center  border-b-2 border-b-slate-700 ">
                            <div className=" flex place-self-center md:text-sm place-items-center ">
                              <p className="text-white pr-1 font-semibold lg:text-lg ">
                                {review.movieData.Year}
                              </p>{" "}
                              <p className="text-slate-500 text-xs lg:text-lg px-2 flex">
                                {review.movieData.Genre}{" "}
                              </p>
                            </div>
                            <div className="text-white place-self-center flex lg:flex p-1 ">
                              <Link
                                className="text-xs bg-yellow-500 font-bold text-black rounded-md p-1 cursor-pointer"
                                href={`https://www.imdb.com/title/${review.movieData.imdbID}`}
                                target="_blank"
                              >
                                <strong>IMDb</strong>
                              </Link>
                              <p className="pl-1 font-semibold">
                                {review.movieData.imdbRating}
                              </p>
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
                                            setLoading(!loading) &
                                            handleDeleteReview(review._id)
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
                </div>
              ))
            ) : (
              <div className="bg-slate-900 h-full">
                <div className=" container rounded-lg flex justify-center h-full w-full ">
                  <div className="flex  pt-10">
                    <p>No reviews to display...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;
