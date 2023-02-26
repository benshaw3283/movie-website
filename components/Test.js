import * as Dialog from '@radix-ui/react-dialog';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useState} from 'react';
import movieList from '../pages/movieList';
import radixStyles from '../styles/radixSign.module.css';
import styles from '../styles/review.module.css'
import Image from 'next/image';
import Avatar from '../public/Avatar.jpg';

const Auto = () => { 
    const [selectedMovie, setSelectedMovie] = useState(null);

    return ( 
        <div>                           
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

        </div>
        </div>  
        </div>    
      )
    }

    export default Auto


 