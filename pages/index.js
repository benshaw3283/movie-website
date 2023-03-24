import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import MovieAutocomplete from "../components/Autocomplete";
import Link from "next/link";
import ReviewFeed from "../components/ReviewFeed";

export default function Home() {
  return (
    <div>
      <title>Movie Website</title>

      <div className={styles.homeMainDiv}>
        <div className={styles.homeMainDivLeft}>
          <p>gg</p>
        </div>

        <div id="mainDivMiddle" className={styles.homeMainDivMiddle}>
          <br></br>
          <div className="bg-gray-500  text-white font-bold py-6 px-6 rounded w-3/4 ">
            <div className="bg-white rounded float-center w-1/2">
              <MovieAutocomplete />
            </div>
          </div>
          <br></br>

          <div className="bg-gray-500 w-3/4 h-1/3">
            
          </div>
        </div>

        <div className={styles.homeMainDivRight}>
          <p>dsggs</p>
        </div>
      </div>
    </div>
  );
}
