import { useRouter } from "next/router";
import { MongoClient } from "mongodb";
import { useSession, signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Image from "next/dist/client/image";
import styles from "/styles/radixAlertDialog.module.css";
import IMDbIcon from "/public/imdb.png";
import dynamic from "next/dynamic";
import * as Dialog from "@radix-ui/react-dialog";
import dialogStyles from "/styles/radixSign.module.css";

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

  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

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

  return { props: { user, session, posts } };
}

export default function UserProfilePage({ user, posts }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);

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
  }, [posts]);

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
            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container justify-center  flex w-1/2 h-1/4 order-2 ">
            <Image src={user.image} alt='f' width={300} height={10} className="float-left "/>
              <div className="flex flex-col container justify-center  h-60">
              
                <div className="order-1 ">
                
                  <h1 className="text-white">{user.username}</h1>

                </div>
                <div className="order-2">
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button className="">Edit profile picture</button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className={dialogStyles.DialogOverlay}>
                        <Dialog.Content className={dialogStyles.DialogContent}>
                          <Dialog.Title className={dialogStyles.DialogTitle}>
                            <strong> Edit profile picture </strong>
                          </Dialog.Title>
                          <Dialog.Description
                            className={dialogStyles.DialogDescription}
                          >
                            Make changes to your profile here.
                          </Dialog.Description>

                          <EditAvatar username={session.user.username} />

                          <div
                            style={{
                              display: "flex",
                              marginTop: 25,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Dialog.Close asChild>
                              <button className="Button green">
                                Save changes
                              </button>
                            </Dialog.Close>
                          </div>
                          <Dialog.Close asChild>
                            <button className="IconButton" aria-label="Close">
                              X
                            </button>
                          </Dialog.Close>
                        </Dialog.Content>
                      </Dialog.Overlay>
                    </Dialog.Portal>
                  </Dialog.Root>
                  </div>
                  
              </div>
            </div>

            <div className="order-3 ">
              <br></br>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg container grid grid-cols-2  w-5/6 min-h-fit order-4 py-2">
              <h1 className="absolute justify-self-center">POSTS</h1>
              {reviews.length ? (
                reviews.map((review, index) => (
                  <div key={index} className="">
                    <div className=" w-full px-4  ">
                      <div className="bg-slate-800 container rounded-lg flex flex-col h-full w-4/5 my-10 border-2 border-slate-700 ">
                        <div className="order-1  w-full h-12 rounded-t-lg  bg-green-400 border-b-2 border-b-slate-700">
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
                                {review.movieData.Year} ||{" "}
                                {review.movieData.Genre} ||
                              </div>
                              <div className="text-gray-500 ">
                                <Image alt="IMDbLogo" src={IMDbIcon} />{" "}
                                {review.movieData.imdbRating}
                              </div>
                            </div>

                            <div className="bg-black h-5/6 flex flex-row container  border-b-2 border-b-slate-700">
                              <div className="absolute w-64 italic text-gray-500 text-xs py-1 px-1 order-1">
                                <p>{review.movieData.Plot}</p>{" "}
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
                        <div className="order-3 w-full h-12 rounded-b-lg bg-red-500  border-t-2 border-t-slate-700">
                          <div className="flex flex-row w-full h-12 justify-around">
                            <p className="text-black self-center cursor-pointer">
                              Like
                            </p>
                            <p className="text-black self-center cursor-pointer">
                              Comment
                            </p>
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
