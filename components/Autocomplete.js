import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useEffect, useRef, useState } from "react";
import movieList from "./MovieList";

import styles from "../styles/review.module.css";
import { useSession } from "next-auth/react";
import { RadixSlider } from "./RadixComponents";
import { useRouter } from "next/router";
//import { makeStyles } from "@mui/styles";
import tvList from "./TvList";
import * as Tooltip from "@radix-ui/react-tooltip";

async function createPost(
  sliderRating,
  user,
  movieData,
  textReview,
  userImage
) {
  const response = await fetch("/api/mongoReviews/mongoCreateReview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sliderRating,
      user,
      movieData,
      textReview,
      userImage,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create post.");
  }

  const result = await response.json();
  return result;
}

const getUserImage = async (user) => {
  const response = await fetch(
    `/api/mongoReviews/mongoGetUserByReview?username=${user}`
  );
  const result = response.json();
  return result;
};

const MovieAutocomplete = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const textReviewRef = useRef("");
  const { data: session } = useSession();
  const router = useRouter();
  const [switchType, setSwitchType] = useState(true);

  async function submitHandler(event) {
    event.preventDefault();

    const sliderRating = sliderValue;
    const user =
      session.user.username || session.user.name || session.user.email;
    const textReview = textReviewRef.current.value;

    const userImage = await getUserImage(user);

    //movieTitle only used for url now
    const movieTitle = selectedMovie;
    const url = `https://www.omdbapi.com/?apikey=4f46879e&r=json&t=${movieTitle}`;
    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);
    const result = await response.json();

    const movieData = result;

    if (
      movieData.Title === "Null" ||
      movieData.Response === "False" ||
      movieData.Error
    ) {
      alert("Failed to find film - Please try again");
    } else {
      try {
        await createPost(sliderRating, user, movieData, textReview, userImage);

        router.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleSwitch = () => {
    setSwitchType(!switchType);
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.content}>
          <br></br>

          <fieldset className="flex gap-2 items-center mb-3 justify-center ">
            <div className="flex flex-row ">
              <div>
                {switchType ? (
                  <div className="flex flex-col justify-center bg-slate-700 rounded-lg border-2 border-slate-600 mr-2">
                    <button className="flex order-1 px-1 bg-slate-800 text-lg rounded-t-lg">
                      Movie
                    </button>

                    <button
                      className="flex order-2 text-lg px-1 "
                      onClick={() =>
                        !session ? alert("Please sign in") : handleSwitch()
                      }
                    >
                      TV show
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center bg-slate-700 rounded-lg border-2 border-slate-600 mr-2">
                    <button
                      className="flex order-1 px-1  text-lg rounded-lg"
                      onClick={() => handleSwitch()}
                    >
                      Movie
                    </button>

                    <button className="flex order-2 text-lg px-1 bg-slate-800 rounded-b-lg">
                      TV show
                    </button>
                  </div>
                )}
              </div>
              <div className="flex order-1 pr-2 ">
                <Autocomplete
                  options={switchType ? movieList : tvList}
                  id="titles"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={switchType ? "Movie" : "TV show"}
                      variant="outlined"
                      className="bg-slate-700 rounded-lg "
                    />
                  )}
                  getOptionLabel_={(option) => option.name}
                  style={{ width: 280 }}
                  freeSolo={true}
                  autoSelect={true}
                  value={selectedMovie}
                  onChange={(_event, newMovie) => {
                    setSelectedMovie(newMovie);
                  }}
                />
              </div>
              <div className="flex order-2 place-self-center ">
                <p></p>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-400 cursor-help"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                      </svg>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className={styles.TooltipContent}
                        sideOffset={5}
                      >
                        {`If the title you want to review doesn't show up, type it in full and press enter`}
                        <Tooltip.Arrow />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
          </fieldset>

          <div className="flex justify-center">
            <h1 className="font-serif:Georgia">{selectedMovie}</h1>
          </div>

          <div className="flex flex-col justify-center place-items-center">
            <br></br>

            <div className="flex justify-center border-2 w-fit place-items-center p-1 border-slate-700 rounded-lg ">
              <div className=" cursor-pointer flex ">
                <RadixSlider
                  min={0}
                  step={1}
                  max={100}
                  inverted="false"
                  dir="RTL"
                  aria-label="Volume"
                  defaultValue={[80]}
                  value={[sliderValue]}
                  onValueChange={([value]) => setSliderValue(value)}
                  size="large"
                  rating={sliderValue}
                />
              </div>
              <div
                className={
                  sliderValue !== 100
                    ? "flex text-white pl-6"
                    : "flex text-amber-300 pl-6 "
                }
              >
                <strong>{sliderValue}</strong>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex justify-center h-32">
            <textarea
              className="bg-slate-800 w-3/4 h-full flex resize-none border-2 border-slate-700 rounded-lg pl-2"
              type="text"
              placeholder="Create Review..."
              maxLength="300"
              wrap="soft"
              ref={textReviewRef}
            ></textarea>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 25,
          justifyContent: "center",
          paddingBottom: "1%",
        }}
      >
        <button
          className="bg-slate-900 border-2 border-slate-600 hover:bg-slate-600 hover:border-slate-900 text-white hover:text-black 
          font-bold py-2 px-4 rounded-full hover:font-bold "
          role="submit"
          onClick={submitHandler}
        >
          Create Review
        </button>
      </div>
    </div>
  );
};

export default MovieAutocomplete;
