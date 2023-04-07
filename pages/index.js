
import styles from "../styles/Home.module.css";
import MovieAutocomplete from "../components/Autocomplete";
import ReviewFeed from "../components/ReviewFeed";
import { ReviewContext } from "../components/Autocomplete";

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
          <div className="bg-gray-500  text-white font-bold py-1 px-1 rounded w-3/4 ">
            <div className="bg-white rounded float-center w-full">
            

              <MovieAutocomplete />

           
            </div>
          </div>
          <br></br>

          <div className="">
            <ReviewFeed/>
          </div>
        </div>

        <div className={styles.homeMainDivRight}>
          <p>dsggs</p>
        </div>
      </div>
    </div>
  );
}
