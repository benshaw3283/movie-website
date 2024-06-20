import React from "react";
import * as Popover from "@radix-ui/react-popover";
import styles from "../styles/commentSection.module.css";
import { useState, useEffect, useRef } from "react";
import UserImage from "./UserImageNav";
import commentIcon from "../public/commentIcon.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import alertStyles from "../styles/radixAlertDialog.module.css";

const CommentSection = (props) => {
  const [comments, setComments] = useState([]);
  const commentRef = useRef();
  const { data: session, status } = useSession();
  const router = useRouter();

  async function fetchComments() {
    const response = await fetch(
      `../api/mongoReviews/mongoGetComments?postId=${props.postId}`
    );

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data)) {
        const unsorted = data.map((comment) => ({ ...comment }));

        setComments(() => {
          const updatedComments = [...unsorted];
          return updatedComments;
        });
      } else {
        setComments(() => []);
      }
    } else {
      console.error("Failed to fetch comments:", response.status);
    }
  }

  async function createComment() {
    if (commentRef.current.value === "") {
      return null;
    }
    const response = await fetch("/api/userActions/createComment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: props.postId,
        user: session.user.username,
        comment: commentRef.current.value,
        postCreator: props.postCreator,
      }),
    });
    commentRef.current.value = "";

    if (response.ok) {
      fetchComments();
    }
    return response;
  }

  const deleteComment = async (commentid) => {
    const response = await fetch("/api/userActions/deleteComment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: props.postId,
        commentID: commentid,
      }),
    });
    if (response.ok) {
      fetchComments();
    }
    return response;
  };

  const timeDifference = (date) => {
    const current = new Date();
    const commentDate = new Date(date);
    const differenceMilli = current.getTime() - commentDate.getTime();
    const differenceMinutes = differenceMilli / 60000;
    const number = parseInt(differenceMinutes);
    let output = 0;
    if (number < 60) {
      output = `${parseInt(number)}m`;
    } else if (number >= 60 && number < 1440) {
      output = `${parseInt(number / 60)}h`;
    } else if (number >= 1440 && number < 10080) {
      output = `${parseInt(number / 1440)}d`;
    } else if (number >= 10080) {
      output = `${parseInt(number / 10080)}w`;
    }
    return output;
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          onClick={() => fetchComments()}
          className="font-semibold text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={styles.PopoverContent}
          sideOffset={5}
          hideWhenDetached={true}
        >
          {session?.user ? (
            <div className="container flex flex-col ">
              <div className="flex justify-center order-1 sticky top-0 ">
                <h1 className=" text-lg font-semibold underline">Comments</h1>
              </div>
              <div className="h-80 w-full order-2 flex  py-2 px-2 rounded-lg flex-col overflow-y-scroll ">
                {comments.length ? (
                  comments.map((comment, index) => (
                    <div key={index} className="flex my-2 ">
                      <div className="flex ">
                        <div className="text-white bg-slate-900 h-fit rounded-lg p-2 text-sm ">
                          <div className="flex flex-row w-full justify-between">
                            <p
                              onClick={() =>
                                router.push(`user/${comment.user}`)
                              }
                              className="cursor-pointer"
                            >
                              <strong> {comment.user}</strong>
                            </p>
                            <div
                              className={
                                comment.user === session.user.username ||
                                comment.user === session.user.email
                                  ? "flex justify-end pl-2"
                                  : "flex justify-end invisible"
                              }
                            >
                              <AlertDialog.Root {...props}>
                                <AlertDialog.Trigger asChild>
                                  <p className="text-slate-200 cursor-pointer">
                                    x
                                  </p>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal>
                                  <AlertDialog.Overlay
                                    className={alertStyles.AlertDialogOverlay2}
                                  />
                                  <AlertDialog.Content
                                    className={alertStyles.AlertDialogContent2}
                                  >
                                    <AlertDialog.Title
                                      className={alertStyles.AlertDialogTitle2}
                                    >
                                      Delete Comment?
                                    </AlertDialog.Title>

                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 4,
                                        justifyContent: "center",
                                      }}
                                    >
                                      <AlertDialog.Cancel asChild>
                                        <button
                                          type="button"
                                          className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5 h-6 text-sm "
                                        >
                                          Cancel
                                        </button>
                                      </AlertDialog.Cancel>
                                      <AlertDialog.Action
                                        asChild
                                        onClick={() =>
                                          deleteComment(comment.commentID)
                                        }
                                      >
                                        <button className="bg-slate-700 border-2 border-slate-800 rounded py-0.5 px-0.5 h-6 text-sm ">
                                          Delete
                                        </button>
                                      </AlertDialog.Action>
                                    </div>
                                  </AlertDialog.Content>
                                </AlertDialog.Portal>
                              </AlertDialog.Root>
                            </div>
                          </div>
                          <div className="flex flex-row">
                            <p className="text-slate-300 pr-2">
                              {timeDifference(comment.date)}
                            </p>
                            <p>{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex pl-28">
                    <p className="text-black flex ">No comments to display</p>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 flex z-10 order-3  w-full   rounded-lg h-10">
                <div className="flex items-center w-full">
                  <UserImage width={30} height={30} />
                  <input
                    ref={commentRef}
                    className="h-full rounded-lg w-full px-2 mx-1 bg-slate-700 "
                    onKeyDown={(e) =>
                      e.key === "Enter" ? createComment(props.postId) : null
                    }
                  ></input>
                  <button
                    type="submit"
                    className="self-center flex ml-1"
                    onClick={() => createComment(props.postId)}
                  >
                    <Image
                      src={commentIcon}
                      width={30}
                      height={30}
                      alt="icon"
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="flex justify-center text-3xl bg-slate-700">
              Please sign in
            </p>
          )}
          <Popover.Close />
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default CommentSection;
