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
import Like from "../../components/like";
import connectToDatabase from "../../lib/connectToDatabase";

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

  const client = await connectToDatabase()

 
  // Fetch user data
  const user = await client
    .db()
    .collection("users")
    .findOne({ username }, { projection: { password: 0, _id: 0 } });

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
    const averageRating = (sliderRatings.reduce(
      (total, rating) => total + rating,
      0
    ) / sliderRatings.length).toFixed(1);
    

  return { props: { user, session, posts,averageRating   } };
}

export default function UserProfilePage({ user, posts, averageRating }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [following, setFollowing] = useState(false);
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

      if (user.followers.includes(session.user.username)) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }

    

    postsHandler();
  }, [posts, session.user.username, user.followers]);

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
        <div className="bg-slate-900  w-full h-full">
          <div className="flex flex-col items-center w-full h-full">
            <div className="order-1 ">
              <br></br>
            </div>
            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center  flex w-1/2 h-1/4 order-2 overflow-clip">
              <Image
                src={user.image}
                alt="f"
                width={300}
                height={100}
                className="float-left "
              />
              <div className="flex flex-col container justify-between py-2 h-60">
                <div className="order-1 place-self-center bg-slate-800 h-16 w-fit rounded-lg border-2 border-slate-700 py-2 px-2">
                  <h1 className="text-white font-bold font-mono text-5xl">
                    {user.username}
                  </h1>
                </div>

                <div className="order-2 pl-4 flex">
                  <div className="flex flex-row justify-around container">
                    <div className="flex ">
                      <h2 className="pr-2">Followers </h2>
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2">
                        {user.followers.length}
                      </p>
                    </div>

                    <div className="flex">
                      <h2 className="pr-2">Reviews</h2>
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2">
                        {reviews.length}
                      </p>
                    </div>

                    <div className="flex">
                      <h2 className="pr-2">Average Rating</h2>
                      <p className="bg-slate-900 h-fit border-2 rounded border-slate-700 px-2">
                        {averageRating}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-3 w-1/2 pl-4">
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
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container grid grid-cols-2  w-5/6 min-h-fit order-4 py-2 ">
              <h1 className="absolute justify-self-center font-semibold text-slate-500 text-xl underline">
                REVIEWS
              </h1>
              {reviews.length ? (
                reviews.map((review, index) => (
                  <div key={index} className=" flex my-4">
                    <div className=" w-full px-4  flex justify-center">
                      <div className="bg-slate-800 container rounded-lg flex flex-col h-full w-4/5   ">
                        <div className="order-1  w-full h-12 rounded-t-lg  bg-green-400 border-2 border-slate-700">
                          <div className="text-red-400 flex inset-x-0 top-0 justify-start float-left">
                            <Image
                              alt="userImage"
                              src={user.image}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="flex pl-2">
                            <h1 className="text-black font-semibold text-lg">
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
                            <div className=" bg-blue-400 flex justify-center  border-b-2 border-b-slate-700 cursor-pointer" onClick={()=> router.push(`../titles/${review.movieData.Title}`)}>
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
                                        className={
                                          styles.AlertDialogDescription
                                        }
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
                <div className="bg-slate-900 h-screen">
                  <div className="bg-slate-800 container rounded-lg flex justify-center h-full w-full ">
                    <div className="justify-center ">
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
