import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useRef, useState } from "react";
import movieList from "../pages/movieList";
import radixStyles from "../styles/radixSign.module.css";
import styles from "../styles/review.module.css";
import { useSession } from "next-auth/react";
import { RadixSlider } from "./RadixComponents";
import { useRouter } from "next/router";

async function createPost( sliderRating, user, movieData, textReview) {
  const response = await fetch("/api/mongoReviews/mongoCreateReview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      
      sliderRating,
      user,
      movieData,
      textReview
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create post.");
  }

  const result = await response.json();
  return result;
}

const MovieAutocomplete = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const textReviewRef = useRef('')
  const { data: session } = useSession();
  const router = useRouter();

  async function submitHandler(event) {
    event.preventDefault();

    
    const sliderRating = sliderValue;
    const user =
      session.user.username || session.user.email || session.user.name;
      const textReview = textReviewRef.current.value

      //movieTitle only used for url now
      const movieTitle = selectedMovie;
    const url = `http://www.omdbapi.com/?apikey=4f46879e&r=json&t=${movieTitle}`;
    const options = {
      method: "GET",
    };


      const response = await fetch(url, options);
      const result = await response.json();
    

    const movieData = result;

    try {
      await createPost( sliderRating, user, movieData, textReview);

      router.reload();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.content}>
          <br></br>

          <fieldset className={radixStyles.Fieldset}>
            <Autocomplete
              id="movies"
              options={movieList}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Movie"
                  variant="outlined"
                  style={{ backgroundColor: "" }}
                />
              )}
              getOptionLabel_={(option) => option.name}
              style={{ width: 280 }}
              value={selectedMovie}
              onChange={(_event, newMovie) => {
                setSelectedMovie(newMovie);
              }}
            />
          </fieldset>
          <div className={styles.movies}>
            <h1>{selectedMovie}</h1>
          </div>

          <div>
            <br></br>
            <div>
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

            <textarea
              className="bg-slate-700 w-3/4 h-full flex resize-none"
              type="text"
              placeholder="Create Review..."
              maxLength="120"
              wrap="soft"
              ref={textReviewRef}
              
            ></textarea>
            
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div
        style={{
          display: "flex",
          marginTop: 25,
          justifyContent: "center",
          paddingBottom: "1%",
        }}
      >
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white 
          font-bold py-2 px-4 rounded-full  "
          role="submit"
          onClick={submitHandler}
        >
          Create Movie Review
        </button>
      </div>
    </div>
  );
};

export default MovieAutocomplete;
