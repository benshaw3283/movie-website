import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useRef, useState } from "react";
import movieList from "../pages/movieList";
import radixStyles from "../styles/radixSign.module.css";
import styles from "../styles/review.module.css";

import { RadixSlider } from "./RadixComponents";
import { useRouter } from "next/router";



async function createPost(movieTitle, sliderRating) {
  const response = await fetch("/api/reviews/createReview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieTitle,
      sliderRating,
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
  

  const router = useRouter();


  async function submitHandler(event) {
    event.preventDefault();

    const movieTitle = selectedMovie;
    const sliderRating = sliderValue;

    try {
       await createPost(movieTitle, sliderRating);

      
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
              style={{ width: 280}}
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
              maxLength='200'
              wrap="soft"
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
