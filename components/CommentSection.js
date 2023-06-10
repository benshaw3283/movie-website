import React from "react";
import * as Popover from "@radix-ui/react-popover";
import styles from "../styles/commentSection.module.css";
import { useState, useEffect, useRef } from "react";
import UserImage from "./UserImageNav";
import commentIcon from "../public/commentIcon.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
    const response = await fetch("/api/userActions/createComment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.postId,
        user: session.user.username,
        comment: commentRef.current.value,
      }),
    });
    commentRef.current.value = "";
    if (response.ok) {fetchComments()}
    return response;
  }

 

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button onClick={() => fetchComments()}>Comment</button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={styles.PopoverContent}
          sideOffset={5}
          hideWhenDetached={true}
        >
          <div className="container flex flex-col ">
            <div className="flex justify-center order-1 sticky top-0 ">
              <h1 className=" text-lg font-semibold underline">Comments</h1>
            </div>
            <div className="h-80 w-full order-2 flex  py-2 px-2 rounded-lg flex-col overflow-y-scroll ">
              {comments.length ? (
                comments.map((comment, index) => (
                  <div key={index} className="flex my-2 ">
                    <div className="flex ">
                      <p className="text-white bg-slate-900 h-fit rounded-lg p-2 text-sm">
                        <p
                          onClick={() => router.push(`user/${comment.user}`)}
                          className="cursor-pointer"
                        >
                          <strong> {comment.user}</strong>
                        </p>

                        {comment.comment}
                      </p>
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
                  <Image src={commentIcon} width={30} height={30} alt="icon" />
                </button>
              </div>
            </div>
          </div>
          <Popover.Close />
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default CommentSection;
