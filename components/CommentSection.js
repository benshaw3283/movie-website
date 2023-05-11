import React from "react";
import * as Popover from "@radix-ui/react-popover";
import styles from "../styles/commentSection.module.css";
import { useState, useEffect } from "react";

const CommentSection = (props) => {
  const [comments, setComments] = useState([]);

  async function fetchComments() {
    const response = await fetch(
      `api/mongoReviews/mongoGetComments?postId=${props.postId}`
    );

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data)) {
        const unsorted = data.map((comment) => ({ ...comment }));
        const sorted = unsorted.reverse();

        setComments(() => {
          const updatedComments = [...sorted];
          return updatedComments;
        });
      } else {
        setComments(() => []);
      }
    } else {
      console.error("Failed to fetch comments:", response.status);
    }
  }

  async function createComment(props) {
    const response = await fetch("/api/userActions/createComment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props,
        user: session.user.username,
        comment: "blah b;lah bal",
      }),
    });
    return response;
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button onClick={() => fetchComments()}>Comment</button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={styles.PopoverContent} sideOffset={5}>
          <div className="flex justify-center ">
            <h1 className=" bg-black">Comments</h1>
          </div>
          {comments.length ? (
            comments.map((comment, index) => (
              <div key={index}>
                <div className="flex flex-col gap-8">
                  <p className="text-black">
                    {comment.user} : {comment.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p className="text-black">No comments to display</p>{" "}
            </div>
          )}

          <div>
            <textarea></textarea>
            <button></button>
          </div>

          <Popover.Close />
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default CommentSection;
