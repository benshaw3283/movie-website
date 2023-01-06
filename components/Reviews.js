import { movieList } from "../pages/movieList";
import { useState } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MovieAutocomplete from "./Autocomplete";
import styles from '../styles/review.module.css';


const Createreviews = () => {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked)  
    }

    return (
        <div>
            <MovieAutocomplete/>        
            <div>
            { clicked ? (
                <div className={styles.main}>
                    <MovieAutocomplete/>
                <h1>HI</h1>
                </div>
            ): null
        }
            </div>
        </div>  
    )
 }
export default Createreviews;