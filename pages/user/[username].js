import { useRouter } from "next/router";
import { useSession, signOut, getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/dist/client/image";
import styles from "/styles/radixAlertDialog.module.css";
import IMDbIcon from "/public/imdb.png";
import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";
import dialogStyles from "/styles/radixSign.module.css";
import CommentSection from "../../components/CommentSection";
import Like from "../../components/LikeComponent";
import connectToDatabase from "../../lib/connectToDatabase";
import { FadeLoader } from "react-spinners";

const EditAvatar = dynamic(() => import("/components/EditAvatar"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

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
  const { username } = context.query;
  const session = await getSession(context);

  const client = await connectToDatabase();

  // Fetch user data
  const user = await client
    .db()
    .collection("users")
    .findOne(
      {
        $or: [{ username: username }, { name: username }],
      },
      { projection: { password: 0, _id: 0 } }
    );

  if (!user) {
    return { notFound: true };
  }

  // Fetch user's posts
  const data = await client
    .db()
    .collection("posts")
    .find({ user: username })
    .toArray();

  const posts = JSON.parse(JSON.stringify(data));

  const sliderRatings = posts.map((post) => post.sliderRating);
  const averageRating = (
    sliderRatings.reduce((total, rating) => total + rating, 0) /
    sliderRatings.length
  ).toFixed(1);

  return { props: { user, session, posts, averageRating } };
}

export default function UserProfilePage({ user, posts, averageRating }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false)
  const bioRef = useRef("");

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

      if (
        user.followers?.includes(session.user.username || session.user.name)
      ) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }

    postsHandler();
  }, [posts, session.user.username, session.user.name, user.followers]);

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

  async function handleFollow() {
    try {
      setFollowing(true);
      const response = await fetch("/api/userActions/follow", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          follower: session.user.username,
        }),
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUnfollow() {
    try {
      setFollowing(false);
      const response = await fetch("/api/userActions/unfollow", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          follower: session.user.username,
        }),
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function handleEditBio() {
    const bio = bioRef.current.value;
    try {
      const response = await fetch("/api/userActions/editBio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          bio: bio,
        }),
      });
      router.reload();
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return (
      <div>
        <div className="bg-slate-900  w-full h-full min-h-screen">
          <div className="flex flex-col items-center w-full h-full">
            <div className="order-1 ">
              <br></br>
            </div>
            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center  flex lg:w-1/2 w-11/12 h-1/4 order-2 overflow-clip">
              <div className=" lg:w-56 lg:place-self-center pr-4 lg:pl-0 ">
              <Image
                src={user.image}
                alt="f"
                width={300}
                height={50}
                className="float-left rounded-full lg:h-5/6 lg:w-44 h-24 w-24  absolute lg:relative lg:ml-1"
              />
              </div>
              <div className="flex flex-col container justify-between py-2 h-60">
                <div className="order-1 place-self-center bg-slate-800 h-16 w-fit rounded-lg border-2 border-slate-700 py-2 px-2">
                  <h1 className="text-white font-bold font-mono lg:text-5xl text-2xl">
                    {user.username || user.name}
                  </h1>
                </div>

                <div className="order-2 lg:pl-4 flex pt-4 lg:pt-0 font-semibold lg:text-base text-sm">
                  <div className="flex flex-row justify-around container">
                    <div className="flex order-1">
                      <h2 className="pr-2">Followers </h2>
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2">
                        {user.followers ? user.followers.length : 0}
                      </p>
                    </div>

                    <div className="flex order-2">
                      <h2 className="pr-2">Reviews</h2>
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2">
                        {reviews.length}
                      </p>
                    </div>

                    <div className="flex order-3">
                      <h2 className="pr-2">Average Rating</h2>
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 lg:px-2 px-1">
                        {averageRating}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-3 w-5/6 pl-4">
                  <p className="text-sm">{user.bio}</p>
                </div>

                <div className="  h-8 w-5/6 order-4 container flex ">
                  {session.user.username === user.username ? (
                    <div className="flex flex-row w-full justify-evenly">
                      <div id="editPic" className="flex order-1">
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <button className="bg-slate-900 px-2 rounded-lg border-2 border-slate-700 font-bold hover:border-slate-900 hover:bg-slate-700 hover:text-black">
                              Edit profile picture
                            </button>
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay
                              className={dialogStyles.DialogOverlay}
                            >
                              <Dialog.Content
                                className={dialogStyles.DialogContent}
                              >
                                <Dialog.Title
                                  className={dialogStyles.DialogTitle}
                                >
                                  <strong> Edit profile picture </strong>
                                </Dialog.Title>
                                <Dialog.Description
                                  className={dialogStyles.DialogDescription}
                                >
                                  Make changes to your profile here.
                                </Dialog.Description>

                                <EditAvatar username={session.user.username} />

                                <Dialog.Close asChild>
                                  <button
                                    className="IconButton"
                                    aria-label="Close"
                                  ></button>
                                </Dialog.Close>
                              </Dialog.Content>
                            </Dialog.Overlay>
                          </Dialog.Portal>
                        </Dialog.Root>
                      </div>
                      <div
                        id="editbio"
                        className="flex order-2 place-self-center"
                      >
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <button className="bg-slate-900 px-2 rounded-lg border-2 border-slate-700 font-bold hover:border-slate-900 hover:bg-slate-700 hover:text-black">
                              Edit Bio
                            </button>
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay
                              className={dialogStyles.DialogOverlay}
                            >
                              <Dialog.Content
                                className={dialogStyles.DialogContent}
                              >
                                <Dialog.Title
                                  className={dialogStyles.DialogTitle}
                                >
                                  <strong> Edit Bio </strong>
                                </Dialog.Title>
                                <Dialog.Description />

                                <textarea
                                  className="bg-slate-800 w-3/4 h-24 flex resize-none border-2 border-slate-700 rounded-sm pl-2"
                                  type="text"
                                  placeholder="Edit Bio..."
                                  maxLength="100"
                                  wrap="soft"
                                  ref={bioRef}
                                ></textarea>

                                <div className="flex mt-16 justify-end ">
                                  <Dialog.Close asChild>
                                    <button
                                      onClick={() => handleEditBio()}
                                      className="bg-slate-900 px-2 rounded-lg border-2 mb-2 border-slate-700 font-bold hover:border-slate-900 hover:bg-slate-700 hover:text-black "
                                    >
                                      Save changes
                                    </button>
                                  </Dialog.Close>
                                </div>
                              </Dialog.Content>
                            </Dialog.Overlay>
                          </Dialog.Portal>
                        </Dialog.Root>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row w-full justify-start">
                      <div id="follow" className="flex order-1 pl-10">
                        {!following ? (
                          <button
                            onClick={() => handleFollow()}
                            className="bg-slate-900 px-2 rounded-lg border-2 border-slate-700 font-bold hover:border-slate-900 hover:bg-slate-700 hover:text-black"
                          >
                            Follow
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnfollow()}
                            className="bg-slate-900 px-2 rounded-lg border-2 border-slate-700 font-bold hover:border-slate-900 hover:bg-slate-700 hover:text-black"
                          >
                            Following
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="order-3 ">
              <br></br>
              <div className=" sticky top-20 left-1/2 lg:pl-64">
      <FadeLoader color='grey' loading={loading} aria-label="loading" 
      />
      </div>
            </div>

            <div className="bg-slate-900 border-4 border-double border-slate-700 rounded-lg container grid lg:grid-cols-2 grid-cols-1  w-5/6 min-h-fit order-4 py-2 ">
           
              <h1 className="absolute justify-self-center font-semibold text-slate-500 text-xl left-1/2">
                REVIEWS
              </h1>
              {reviews.length ? (
                reviews.map((review, index) => (
                  <div key={index}>
                    <div className=" w-full px-4  flex justify-center">
                    <div className="bg-slate-800 container rounded-lg flex flex-col h-2/5 lg:w-5/6 w-full  my-10 border-2 border-slate-700">
                  <div className="order-1  w-full h-12  rounded-t-lg   border-b-2 border-b-slate-700">
                    <div className="flex flex-row ">
                      <div className="flex order-1 w-full">
                        <div
                          className=" flex inset-x-0 top-0 justify-start float-left cursor-pointer"
                          
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
                            setLoading(!loading) &  router.push(`../titles/${review.movieData.Title}`)
                            }
                          >
                            {review.movieData.Title}
                          </h1>
                        ) : (
                          <h1
                            className="text-white lg:text-2xl md:text-sm text-base font-semibold"
                            onClick={() =>
                              setLoading(!loading) & router.push(`../titles/${review.movieData.Title}`)
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
                  </div>
                ))
              ) : (
                <div className="bg-slate-900 h-screen">
                  <div className=" container rounded-lg flex justify-center h-fit w-full ">
                    <div className="justify-center mt-10">
                      <p>No reviews to display...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="order-5">
              <br></br>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
