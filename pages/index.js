import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Signup } from "../components/Sign";
import Createreviews from "../components/Reviews";
import MovieAutocomplete from "../components/Autocomplete";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <title>Movie Website</title>


      <div className={styles.homeMainDiv}>
        <div className={styles.homeMainDivLeft}>
          <p>gg</p>
        </div>

        <div className={styles.homeMainDivMiddle}>
          <MovieAutocomplete/>
        </div>

        <div className={styles.homeMainDivRight}>
          <p>dsggs</p>
        </div>
      </div>
    </div>
  );
}
