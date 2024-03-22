import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import style from "../styles/notifications.module.css";
import { useQuery } from "@tanstack/react-query";
import Overlay from "./Overlay";
import SingleReview from "./SingleReview";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Notifications = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [reviewX, setReviewX] = useState({});

  async function fetchNotifications() {
    try {
      const response = await fetch(
        `/api/mongoReviews/mongoGetNotifications?user=${props.user}`
      );

      if (response.status === 204) {
        // 204 No Content status indicates an empty response, so return an empty array
        return [];
      }

      if (response.ok) {
        return response.json();
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  const goToNotificationsPost = async (commentid, postid, notifDate) => {
    const response = await fetch("/api/userActions/seenNotif", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: session.user.username,
        commentID: commentid,
        notifDate: notifDate,
      }),
    });

    if (!response.ok) {
      console.error("Error updating notification.");
      return;
    }

    const response2 = await fetch(
      `/api/userActions/seenNotif?postID=${postid}`,
      { method: "GET" }
    );

    if (!response2.ok) {
      console.error("Error fetching review data.");
      return;
    }
    const response2JSON = await response2.json();

    setReviewX(response2JSON);
    setIsOverlayOpen(true);

    return response.json();
  };
  const review = reviewX;

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  const goToNotificationFollower = (follower) => {
    router.replace(`/user/${follower}`);
  };

  const { isLoading, error, data, isSuccess } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

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

  let sortedNotifications = [];

  if (data && data.length > 0) {
    sortedNotifications = data.sort((b, a) => {
      return a.date.localeCompare(b.date);
    });
  } else {
    sortedNotifications = [];
  }

  const unseenNotifs = sortedNotifications.filter(
    (notif) => notif.seen === false
  );
  const unseenNotifications = unseenNotifs.length;

  return (
    <div>
      {isOverlayOpen ? (
        <Overlay isOpen={isOverlayOpen} onClose={closeOverlay} type="review">
          <SingleReview review={review} session={session} />
        </Overlay>
      ) : (
        <div>
          <div className="pr-3 pt-1">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <div style={{ position: "center", cursor: "pointer" }}>
                  <div className="flex  align-middle ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 -z-10 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div
                      className={
                        unseenNotifications === 0
                          ? "invisible w-5 h-5 rounded-full bg-red-600 absolute top-2 ml-2"
                          : "w-5 h-5 rounded-full bg-red-600 absolute top-3 ml-2"
                      }
                    >
                      <p
                        className={
                          unseenNotifications >= 10
                            ? " text-white font-semibold ml-[2px] -mt-[1px] text-sm"
                            : " text-white font-semibold ml-[6px] -mt-[1px] text-sm"
                        }
                      >
                        {unseenNotifications}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={style.DropdownMenuContent}
                  sideOffset={10}
                >
                  {isSuccess ? (
                    sortedNotifications.map((notification, index) => (
                      <DropdownMenu.Item
                        className={
                          notification.seen === false
                            ? style.DropdownMenuItem
                            : style.seenNotification
                        }
                        key={index}
                        onClick={() =>
                          notification.comment
                            ? goToNotificationsPost(
                                notification.commentID,
                                notification.postObjectID
                              )
                            : notification.follower
                            ? goToNotificationFollower(notification.follower)
                            : goToNotificationsPost(
                                notification.commentID,
                                notification.postObjectID,
                                notification.date
                              )
                        }
                      >
                        {notification.comment ? (
                          <div className="flex-col flex">
                            <p>
                              <strong>{notification.user}</strong> commented on
                              your review:
                            </p>
                            <div className="flex-row flex ">
                              <p className="text-slate-400 place-self-center">
                                {timeDifference(notification.date)}
                              </p>

                              <p className="text-[12px] pl-2 place-self-center text-slate-200">
                                {notification.comment}
                              </p>
                            </div>
                          </div>
                        ) : notification.follower ? (
                          <div className="flex-row flex">
                            <p className="text-slate-400 place-self-center">
                              {timeDifference(notification.date)}
                            </p>
                            <p className="text-slate-200 place-self-center">
                              <strong>{notification.follower}</strong> followed
                              you.
                            </p>
                          </div>
                        ) : (
                          <div className="flex-row flex">
                            <p className="text-slate-400 place-self-center">
                              {timeDifference(notification.date)}
                            </p>
                            <p className="text-slate-200 place-self-center pl-2">
                              <strong>{notification.user}</strong> liked your
                              review.
                            </p>
                          </div>
                        )}
                      </DropdownMenu.Item>
                    ))
                  ) : (
                    <p>Unable to load notifications</p>
                  )}
                  {error && (
                    <DropdownMenu.Item className={style.DropdownMenuItem}>
                      <p>ERROR</p>
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
