import { movieList } from "../pages/movieList";
import { useState } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MovieAutocomplete from "./Autocomplete";
import styles from '../styles/review.module.css';
import { whiteA } from "@radix-ui/colors";
import * as Dialog from '@radix-ui/react-dialog';



const Createreviews = () => {
    

    return (
        <div>
   <MovieAutocomplete/>
        </div>  
    )
 }
export default Createreviews;