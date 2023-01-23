import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useState} from 'react';
import movieList from '../pages/movieList';
import styles from '../styles/review.module.css';
import Image from 'next/image';
import Avatar from '../public/Avatar.jpg';
import { radixDialog } from './RadixSign';
import Test from '../pages/test'




const MovieAutocomplete = () => { 
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked)
    }
    return ( 
        <div>
    
            <button id='reviewButton' onClick={handleClick}><strong>Create Movie Review</strong></button>
            <div>
                {clicked ? (
                   
                <div className={styles.main}>
                     
                    <div className={styles.content}>
                        <br></br>
                    <Autocomplete id="movies" 
    
                     options={movieList} 
                    renderInput={params => ( <TextField {...params} 
                    label="Movie" 
                    variant="outlined" 
                    className=''
                    style={{backgroundColor: 'white'}}
        />)
    }
        getOptionLabel_={option => option.name}
        style={{ width: 270 }}  
        value={selectedMovie}
        onChange={(_event, newMovie) => {
            setSelectedMovie(newMovie)
        }}
        /> 
                        <h1>{selectedMovie}</h1>
                       <Image alt='Avatar' src={Avatar} width='200px' height='200px'></Image>
                        <form>
                            <label>Rating:</label>
                                <input type='range' min='0' max='10' step='1' list='reviewRange'></input>
                                <datalist id='reviewRange'>
                                    <option id='1' value='1' label='1'></option>
                                    <option value='2' label='2'></option>
                                    <option value='3' label='3'></option>
                                    <option value='4' label='4'></option>
                                    <option value='5' label='5'></option>
                                    <option value='6' label='6'></option>
                                    <option value='7' label='7'></option>
                                    <option value='8' label='8'></option>
                                    <option value='9' label='9'></option>
                                    <option value='10' label='10'></option>
                                </datalist>
                                <br></br>
                                <br></br>
                                <label id='reviewText' className={styles.label}htmlFor='reviewInput'>Review</label>                            
                                <textarea id ='reviewInput' className={styles.reviewInput} type='text' placeholder='Create Review...'></textarea>
                            <Test/>
                        </form>
                    </div>
                    </div>
                ): null
            }

            </div>
        </div>
        ); 
    };

export default MovieAutocomplete