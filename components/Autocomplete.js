import * as Dialog from "@radix-ui/react-dialog";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useRef, useState } from "react";
import movieList from "../pages/movieList";
import radixStyles from "../styles/radixSign.module.css";
import styles from "../styles/review.module.css";
import Image from "next/image";
import Avatar from "../public/Avatar.jpg";
import { radixDialog } from "./RadixSign";
import { RadixSlider } from "./RadixComponents";
import { Slider } from "@radix-ui/react-slider";


const MovieAutocomplete = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);

  const selectedmovieref = useRef(selectedMovie);
  const slidervalueref = useRef(sliderValue);
  const textreviewref = useRef();

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  }

  const movieTitle = selectedmovieref.current;
  const sliderRating = slidervalueref.current;

  
    const postData = {
      movieTitle: movieTitle,
      sliderRating: sliderRating
    }
  

  async function submitHandler(event) {
    event.preventDefault();

   fetch("api/reviews/postReview",{
    method: 'POST',
    body: fortmatResponse(postData),
    headers: {
      "Content-Type": "application/json",
    }
   })
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
                  style={{ backgroundColor: "white" }}
                />
              )}
              getOptionLabel_={(option) => option.name}
              style={{ width: 280, overflowY: "visible" }}
              value={selectedMovie}
              onChange={(_event, newMovie) => {
                setSelectedMovie(newMovie);
              }}
            />
          </fieldset>
          <div className={styles.movies}>
            <h1>{selectedMovie}</h1>
          </div>
          <Image
            alt="Avatar"
            src={Avatar}
            width="200px"
            height="200px"
            style={{ position: "realative", left: "40%" }}
          ></Image>
          <div>
            <br></br>
            <div>
              <div style={{ display: "inline-block", paddingLeft: "20px" }}>
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
                <strong>{sliderValue}</strong>
              </div>
            </div>

            <br></br>
            <label
              id="reviewText"
              className={styles.label}
              htmlFor="reviewInput"
            >
              Review
            </label>
            <textarea
              id="reviewInput"
              className={styles.reviewInput}
              type="text"
              placeholder="Create Review..."
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          role="submit"
          onSubmit={submitHandler}
        >
          Create Movie Review
        </button>
      </div>
      
    </div>
  );
      };

export default MovieAutocomplete;
