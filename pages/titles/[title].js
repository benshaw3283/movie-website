import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/dist/client/image";
import styles from "/styles/radixAlertDialog.module.css";
import IMDbIcon from "/public/imdb.png";

import CommentSection from "../../components/CommentSection";
import Like from "../../components/like";
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

  const url = `http://www.omdbapi.com/?apikey=4f46879e&r=json&t=${title}`;
  const options = {
    method: "GET",
  };
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
          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center  flex w-1/2 h-1/3 order-2 overflow-clip min-h-fit">
            <Image
              src={values.Poster}
              alt="f"
              width={240}
              height={400}
              className="float-left "
            />
            <div className="flex flex-col container justify-between py-2 h-60">
              <div className="order-1 place-self-center bg-slate-800 h-16 w-fit rounded-lg border-2 border-slate-700 py-2 px-2">
                <h1 className="text-white font-bold font-mono text-5xl">
                  {values.Title}
                </h1>
              </div>
              <p
                onClick={() =>
                  window.open(
                    `https://www.imdb.com/title/${values.imdbID}/`,
                    "_blank"
                  )
                }
                className="cursor-pointer underline pl-2 absolute text-blue-600"
              >
                See on IMDB
              </p>
              <div className="flex  order-2">
                <div className="flex flex-row justify-around container px-2">
                  <div className="flex flex-col">
                    <div className="order-1 ">
                      <h2 className="px-2 text-lg flex ">Runtime</h2>
                    </div>
                    <div className="order-2 flex place-self-center">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 text-lg">
                        {values.Runtime}
                      </p>
                    </div>
                  </div>

                  <div className="flex p-2">
                    <h2 className="px-2 text-xl">
                      {values.Director !== "N/A" ? `Director` : `Writer`}
                    </h2>
                    <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 text-xl">
                      {values.Director !== "N/A"
                        ? `${values.Director}`
                        : `${values.Writer}`}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className="order-1 place-self-center flex">
                      <h2 className="px-2 text-lg">Box Office</h2>
                    </div>
                    <div className="order-2 flex place-self-center">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 text-lg">
                        {values.BoxOffice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-3 pl-4 flex">
                <div className="flex flex-row justify-around container px-2">
                  <div className="flex flex-col">
                    <div className="order-1 place-self-center flex">
                      <h2 className="px-2  text-lg">Actors</h2>
                    </div>
                    <div className="order-2">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 ">
                        {values.Actors}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-4 pl-4 flex pt-10">
                <div className="flex flex-row justify-around container">
                  <div className="flex flex-col">
                    <div className="order-1 place-self-center flex">
                      <h2 className="px-2 text-lg">Rated</h2>
                    </div>
                    <div className="order-2 flex place-self-center">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 text-lg">
                        {values.Rated}
                      </p>
                    </div>
                  </div>

                  <div className="flex place-self-end">
                    <h2 className="px-2 text-lg">Reviews</h2>
                    <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 text-lg">
                      {reviews.length}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <div className="order-1 place-self-center flex">
                      <h2 className="px-2 text-lg">Average Rating</h2>
                    </div>
                    <div className="order-2 flex place-self-center">
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2 text-lg">
                        {averageRating !== 'NaN' ? averageRating : '0'}
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
          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container grid grid-cols-2  w-5/6 h-full order-4 py-2 ">
            <h1 className="absolute justify-self-center font-semibold text-slate-500 text-xl underline">
              REVIEWS
            </h1>
            {reviews.length ? (
              reviews.map((review, index) => (
                <div key={index} className=" flex my-4">
                  <div className=" w-full  px-4  flex justify-center">
                    <div className="bg-slate-800 container rounded-lg flex flex-col h-full w-4/5   ">
                      <div className="order-1  w-full h-12 rounded-t-lg  bg-green-400 border-2 border-slate-700">
                        <div
                          className="text-red-400 flex inset-x-0 top-0 justify-start float-left cursor-pointer"
                          onClick={() => router.push(`../user/${review.user}`)}
                        >
                          <Image
                            alt="userImage"
                            src={review.userImage.image}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="flex pl-2">
                          <h1
                            className="text-black font-semibold text-lg cursor-pointer"
                            onClick={() =>
                              router.push(`../user/${review.user}`)
                            }
                          >
                            {review.user}
                          </h1>
                        </div>

                        <p className="text-blue-400 px-8 text-sm">
                          {formatLocalDate(review.createdAt)}
                        </p>
                      </div>
                      <div className="order-2 flex w-full h-3/4  overflow-clip border-x-2 border-slate-700">
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

                          <div className="bg-white flex  justify-center  border-b-2 border-b-slate-700 items-center ">
                            <div className="text-gray-500 self-center ">
                              {review.movieData.Year} ||
                              {review.movieData.Genre} ||
                            </div>
                            <div className="text-gray-500 ">
                              <Image alt="IMDbLogo" src={IMDbIcon} />
                              {review.movieData.imdbRating}
                            </div>
                          </div>

                          <div className="bg-black h-5/6 flex flex-row container  border-b-2 border-b-slate-700">
                            <div className="absolute w-64 italic text-gray-500 text-xs py-1 px-1 order-1">
                              <p>{review.movieData.Plot}</p>
                            </div>

                            <div className="self-center flex order-2 ">
                              <h1 className="text-white text-3xl pl-4 ">
                                {review.sliderRating}
                              </h1>
                            </div>

                            <div className=" self-center flex order-3 pl-8">
                              <p className="text-white pl-2 pt-6 text-sm w-72">
                                {review.textReview}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="order-3 w-full h-12 rounded-b-lg bg-green-500  border-2 border-slate-700">
                        <div className="flex flex-row w-full h-12 justify-around ">
                          <div className="flex self-center">
                            <p>{!review.likes ? "0" : review.likes.length}</p>
                            <Like
                              postId={review._id}
                              reviewLikes={review.likes}
                            />
                          </div>
                          <CommentSection postId={review._id} />

                          <p className="text-black self-center cursor-pointer">
                            Share
                          </p>

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
                                          onClick={() =>
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
                <div className="bg-slate-800 container rounded-lg flex justify-center h-full w-full ">
                  <div className="flex  ">
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