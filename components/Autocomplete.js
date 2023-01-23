import * as Dialog from '@radix-ui/react-dialog';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useState} from 'react';
import movieList from '../pages/movieList';
import radixStyles from '../styles/radixSign.module.css';
import styles from '../styles/review.module.css'
import Image from 'next/image';
import Avatar from '../public/Avatar.jpg';
import { radixDialog } from './RadixSign';
import { RadixSlider } from './RadixComponents';


const MovieAutocomplete = () => { 
    const [selectedMovie, setSelectedMovie] = useState(null);

    return ( 
        <Dialog.Root>

            <Dialog.Trigger asChild>
            <button id='reviewButton'>
                <strong>Create Movie Review</strong>
            </button>
            </Dialog.Trigger>

            <Dialog.Portal> 
                <Dialog.Overlay className={radixStyles.DialogOverlay}>  
                    <Dialog.Content className={radixStyles.DialogContent}>
              
            <div className={styles.main}>
                <div className={styles.content}>
                        <br></br>
    <fieldset className={radixStyles.Fieldset}  >     
 <Autocomplete id="movies" 
    
    options={movieList} 
   renderInput={params => ( <TextField {...params} 
   label="Movie" 
   variant="outlined" 
   style={{backgroundColor: 'white'}}
/>)
}
getOptionLabel_={option => option.name}
style={{width: 280}}  
value={selectedMovie}
onChange={(_event, newMovie) => {
setSelectedMovie(newMovie)
}}
/> 
</fieldset>

<div className={styles.movies}>
                        <h1>{selectedMovie}</h1>
</div>
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
                                <div><RadixSlider/></div>
                                <br></br>
                                <label id='reviewText' className={styles.label}htmlFor='reviewInput'>Review</label>                            
                                <textarea id ='reviewInput' className={styles.reviewInput} type='text' placeholder='Create Review...'></textarea>                           
                        </form> 
                    
                        </div>
                        </div>


            <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <button className={styles.Button}>Submit</button>
            </Dialog.Close>
          </div>

        <Dialog.Close asChild>
            <button className={radixStyles.IconButton} aria-label="Close"></button>
          </Dialog.Close>

                    </Dialog.Content>
                </Dialog.Overlay>          
            </Dialog.Portal> 
        </Dialog.Root>
        ); 
    };

export default MovieAutocomplete