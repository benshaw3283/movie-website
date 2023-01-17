import { movieList } from "../pages/movieList";
import { useState } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MovieAutocomplete from "./Autocomplete";
import styles from '../styles/review.module.css';
import { whiteA } from "@radix-ui/colors";


const Createreviews = () => {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked)  
    }

    return (
        <div>
            <MovieAutocomplete />        
            <div>
            { clicked ? (
                <div className={styles.main}>
                    <MovieAutocomplete/>
                
                </div>
            ): null
        }
            </div>
        </div>  
    )
 }
export default Createreviews;