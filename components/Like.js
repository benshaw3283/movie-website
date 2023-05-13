import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React from "react";

const Like = (props) => {
  const [liked, setLiked] = useState(false);
  const { data: session, status } = useSession();

  async function handleLike() {
    try {
      setLiked(true);
      const response = await fetch("/api/userActions/like", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.postId,
          user: session.user.username,
        }),
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUnlike() {
    try {
      setLiked(false);
      const response = await fetch("/api/userActions/unlike", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.postId,
          user: session.user.username,
        }),
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function ifLiked() {
      const reviewLikes = props.reviewLikes;
      if (!reviewLikes) {
        reviewLikes = [];
      }
      if (reviewLikes.includes(session.user.username)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }

    ifLiked();
  }, [props, session]);

  return (
    <div>
      {!liked ? (
        <button onClick={() => handleLike(props.postId)} className="pl-2">
          <Image
            width={25}
            height={25}
            alt="unliked"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADTElEQVR4nO2ZS2xNURSGv2olaCkDIU0x8ChC0DLwSIzExCNCg4kYCErFSBkQBEmnpJ5BVJuYeM2olmEjRBAJYuCtiXhTVaKtrOQ/yU573J57e3q7m9wvOcm9Z+299lpnr73P2utAhgwZMmTwnCJgJ9AAPAGagVagCagHdgOTk9A3Bdijvk3S1Szddq8CmBSnA7OBm0BHhKsduA7MTKBvltq0R9TZAJT0xIGBQJUz4CfgNLBMs5MLDALGAEuB48Bntf0L7AeyHX32+6Bkgb5jwBLpMF250r0cOKM2wQM6AuQk68QI4JaU/AQOAMMi9BsK7FOYWN/zcsCuWt0z2V617Y5hcr7FmZ3hycxE4MRrhUKyWGi9ko5ax4mXwIwU9JUAbxxnIs1MleNEAakzTjqCWDfHxvZAX4HjzOEoC7td4ZTKTIQ9yVZdxTHoK1aYtXWnL9idbE3ERYWuuDgkG22LDqXI2U2iLOyoBIs9LvKd3XFiWINdEtoW6ztnZeuOMGG9hLaH+84K2XojTPhMwgn4T5FsfRom/CFhHv6TJ1vN5i4Eb09LFXxniJN1dOGdhD15CaaLQtlqL8guPJSwR5lmmpgjWx+ECWsk3Iz/bJWt58KE5RJW4z81snXL/05sJvzi+YIfDHyTrbYNh3JPDUrxlzWy8U6iRtvUyBzKwj+ygPuysay7aWtSw5X4xyrZ9jZK+Jc7e7Rlmr6QLwf+u8g7Y8fIu+pgWaYvVMum28kcC6Y7BYRN9D1lsuUXMDXZzhvU+TewiL5jsWwwW9anqiQoRFgFcB7pZ4ESw0gFh0RYLF5wnEnnzCwEvmvsi3Ecl63OddWJ0bX0Pms1lo15STbEQrZKmEGN6mQq5cuI41Q6Zdqa3hgnS+XQNg1yTaXVuDBdddLdprJqr2YXVrD+qgGfA3Nj0DkfeOEkrVbYTgtWoHjkVN4rU4zjHH1z+SNdT5SFp70AcMpZN43A+CQfRqPz2eCEPiv06QsrOO+36AkPSNDe4n6jU7V5r28uXjASuOzMTp0KBJ0pVFGtw9lara93lAIfZKRtCKsdmVUwPzoL2mbFa0YDV5ynbmnOUee/zdwo+hHrlNYEDtibejv9lGnAY132u1+T79lJMwPp4B+umggDgRN8wAAAAABJRU5ErkJggg=="
          />
        </button>
      ) : (
        <button onClick={() => handleUnlike(props.postId)} className="pl-2">
          <Image
            width={25}
            height={25}
            alt="liked"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACtElEQVR4nO2YS2sUQRSFr/EBOnVO5YGE7H0EURQUXCnu3AiKC5cuXSkqonGrCLpVAgrBTVQQ/Adm1IUPVCKEYTK3ZjYBN0YFQSYLYyQjFSdqSCfTPdOZ7oY5cKBp6Nv341RVV5dIRx111FFHaZYCO521QwrklVQHzDhy1pGfHPBcgWvl7u69YeuVrd2nwHX/7EINXwuY8bUVGHPGXCkBO+IDIA8o8MyRtTBW8mXZmMMr1rP2iJKvQtcD8mrt/qYBxkU2KjCs5HzYl/4HM++Aex9FNi/W89dKjkSt5f7Vu/NCZEMkiIK1PfXIay36ja9VJHuVfNtqPQXyU9Z2h04iJohFv/ZAcdVTIB8qGT+cYoRYK99uPLGbmBPttpLzqy4AUVanpK3AWCCEM2Yw6eZcRAd+Zxx5NenGXPRULgcNq7GkG3NRDTwNSqSSeGOMbLccBKhmMJFqUCKzqWiO4a3kj6BvyNcMgnwOSqSQORBgImjVepx0Yy6qgUdBIJcyCHJhGUgpl9udeGOMaGMGl4HU50kx8eYY2oVAiPrwOp+CBmthrOS5FUEm+vtzfknLAMQX7evDiiALwwu4mHSjroFL5FlpJP8b6YAPqU0DmAh9CKG53J76uVUtVQaqfnWVKCoZczJNv736p5dTkSD+JgPcTFEaN6RZ1UTWO+Bh0hBKjtZEupoGqcN0OfJ+ghAjLUMsgQHuth0CGK6JrJO4pdaeceRcG1L45U/+YwdYAkMedcC3NUzhewk4Ju3QJLBdgfdrAPGuSG6TdmphB2DtkCN/xgAxp8CtosgmSUpl4GBLR0nAVNmYQ5IGjQ8MbPEn5E1M6tGGu9gk5Iw54cjpEBDTzpjjkmYVrO1R8sEqQ+lJxZitkhWVgdNLdtDAjL8nWVTFmF1KTnr7a8myKr299E66j46kzfoNNK1fjkAjU40AAAAASUVORK5CYII="
          />
        </button>
      )}
    </div>
  );
};

export default Like;
