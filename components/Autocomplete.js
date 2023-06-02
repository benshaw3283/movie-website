import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useRef, useState } from "react";
import movieList from "../pages/movieList";
import radixStyles from "../styles/radixSign.module.css";
import styles from "../styles/review.module.css";
import { useSession } from "next-auth/react";
import { RadixSlider } from "./RadixComponents";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";

async function createPost(sliderRating, user, movieData, textReview, userImage) {
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
      userImage
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

  async function submitHandler(event) {
    event.preventDefault();

    const sliderRating = sliderValue;
    const user =
      session.user.username || session.user.email || session.user.name;
    const textReview = textReviewRef.current.value;

    const userImage = await getUserImage(user);

    //movieTitle only used for url now
    const movieTitle = selectedMovie;
    const url = `http://www.omdbapi.com/?apikey=4f46879e&r=json&t=${movieTitle}`;
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

  const useStyles = makeStyles({
    paper: {
      border: "4px white",

      backgroundColor: "rgb(100 116 139)",
    },
  });

  const classes = useStyles();

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.content}>
          <br></br>
          
    
          <fieldset className='flex gap-2 items-center mb-3 justify-center '>
          <div className="flex flex-row ">
      <div className="flex order-1 pr-2 ">
            <Autocomplete
              options={movieList}
              id="movies"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Movie"
                  variant="outlined"
                  className="bg-slate-700 rounded-lg "
                />
              )}
              getOptionLabel_={(option) => option.name}
              classes={{ paper: classes.paper }}
              style={{ width: 280 }}
              freeSolo={true}
              autoSelect={true}
              value={selectedMovie}
              onChange={(_event, newMovie) => {
                setSelectedMovie(newMovie);
              }}
            />
            </div>
            <div className="flex order-2 place-self-center absolute pl-72" >

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 cursor-help">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
</svg>
            </div>
            </div>
      
          </fieldset>
          
          <div className="flex justify-center">
            <h1>{selectedMovie}</h1>
          </div>
          


          <div>
            <br></br>
            <div className="flex justify-center">
              <div className="inline-block cursor-pointer ">
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
                />
              </div>
              <div
                style={{
                  display: "inline-block",
                  paddingLeft: "20px",
                  color: "black",
                }}
              >
                <strong>{sliderValue}/100</strong>
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
