import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useEffect, useRef, useState } from "react";
import movieList from "./MovieList";
import { useToast } from "@/components/ui/use-toast";

import styles from "../styles/review.module.css";
import { useSession } from "next-auth/react";
import { RadixSlider } from "./RadixComponents";
import { useRouter } from "next/router";
//import { makeStyles } from "@mui/styles";
import tvList from "./TvList";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FadeLoader } from "react-spinners";
import Overlay from "./Overlay";

async function createPost(
  sliderRating,
  user,
  movieData,
  textReview,
  userImage,
  likes
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
      likes,
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
  const [loading, setLoading] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const { toast } = useToast();

  async function submitHandler() {
    const sliderRating = sliderValue;
    const user =
      session.user.username || session.user.name || session.user.email;
    const textReview = textReviewRef.current.value;

    const userImage = await getUserImage(user);

    //free api - exposed key is fine
    const movieTitle = selectedMovie;
    let url = `https://www.omdbapi.com/?apikey=4f46879e&r=json&t=${movieTitle}`;
    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);
    const result = await response.json();

    const movieData = result;
    const likes = [];

    if (
      movieData.Title === "Null" ||
      movieData.Response === "False" ||
      movieData.Error
    ) {
      toast({
        title: "Failed to find film - check spelling",
        className: "bg-slate-900 text-white ",
        variant: "destructive",
      });
    } else {
      try {
        await createPost(
          sliderRating,
          user,
          movieData,
          textReview,
          userImage,
          likes
        );
        setIsOverlayOpen(true);
        setLoading(true);
        router.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleSwitch = () => {
    setSwitchType(!switchType);
  };

  function alertSign() {
    alert("Please sign in");
  }

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div>
      {isOverlayOpen && (
        <Overlay isOpen={isOverlayOpen} onClose={closeOverlay} type="spinner">
          <FadeLoader color="grey" loading={loading} aria-label="loading" />
        </Overlay>
      )}
      <div className="w-fit h-fit flex justify-around border-slate-600 border-double">
        <div className={styles.content}>
          <br></br>

          <fieldset className="flex gap-2 items-center mb-3 justify-center">
            <div className="flex flex-row ">
              <div>
                {switchType ? (
                  <div className="flex flex-col mt-1.5 bg-slate-700 rounded-lg border-2 border-slate-600 mr-1 ">
                    <button className="flex order-1 justify-center file:px-1 bg-slate-800 lg:text-lg text-sm rounded-t-lg text-white">
                      Movie
                    </button>

                    <button
                      className="flex order-2 lg:text-lg text-sm px-1 text-white"
                      onClick={() =>
                        !session ? alert("Please sign in") : handleSwitch()
                      }
                    >
                      TV show
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col mt-1.5 justify-center bg-slate-700 rounded-lg border-2 border-slate-600 mr-1">
                    <button
                      className="flex order-1 px-1 justify-center  lg:text-lg text-sm rounded-lg text-white"
                      onClick={() => handleSwitch()}
                    >
                      Movie
                    </button>

                    <button className="flex order-2 lg:text-lg text-sm px-1 bg-slate-800 rounded-b-lg text-white">
                      TV show
                    </button>
                  </div>
                )}
              </div>
              <div className="flex order-1 pr-2 ">
                {switchType ? (
                  <Autocomplete
                    options={movieList}
                    id="titles"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"Movie"}
                        variant="outlined"
                        className="bg-slate-700 rounded-lg w-52 lg:w-72 z-0 lg:mt-2"
                      />
                    )}
                    getOptionLabel_={(option) => option.name}
                    style={{ width: 200 }}
                    freeSolo={true}
                    autoSelect={true}
                    value={selectedMovie}
                    onChange={(_event, newMovie) => {
                      setSelectedMovie(newMovie);
                    }}
                  />
                ) : (
                  <Autocomplete
                    options={tvList}
                    id="titles"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={"TV show"}
                        variant="outlined"
                        className="bg-slate-700 rounded-lg w-52 lg:w-72 z-0 lg:mt-2"
                      />
                    )}
                    getOptionLabel_={(option) => option.name}
                    style={{ width: 200 }}
                    freeSolo={true}
                    autoSelect={true}
                    value={selectedMovie}
                    onChange={(_event, newMovie) => {
                      setSelectedMovie(newMovie);
                    }}
                  />
                )}
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
            <h1 className="font-serif:Georgia text-xl font-semibold">
              {selectedMovie}
            </h1>
          </div>

          <div className="flex flex-col justify-center place-items-center">
            <br></br>

            <div className="flex justify-center  lg:w-fit  place-items-center p-1  ">
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
                  rating={sliderValue}
                />
              </div>
              <div className="flex text-white text-xl pl-6 font-semibold">
                <strong>{sliderValue}</strong>
              </div>
            </div>
          </div>
          <br></br>
          <div className="flex justify-center lg:h-32 h-16">
            <textarea
              className="bg-slate-800 w-3/4 lg:h-full h-full flex resize-none border-2 border-slate-700 rounded-lg pl-2 text-sm lg:text-lg"
              type="text"
              placeholder="hmmm?"
              maxLength="200"
              wrap="soft"
              ref={textReviewRef}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex lg:mt-10 mt-4 justify-center pb-1">
        <button
          className="bg-slate-900 border-2 border-slate-600 hover:bg-slate-600 hover:border-slate-900 text-white hover:text-black 
          font-bold py-2 px-4 rounded-full hover:font-bold "
          role="submit"
          onClick={() =>
            session
              ? submitHandler()
              : toast({
                  title: "Please sign in to post a review!",
                  className: "bg-slate-900 text-white",
                })
          }
        >
          Create Review
        </button>
      </div>
    </div>
  );
};

export default MovieAutocomplete;
