import * as Dialog from '@radix-ui/react-dialog';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useState} from 'react';
import movieList from '../pages/movieList';
import styles from '../styles/radixSign.module.css';
import Image from 'next/image';
import Avatar from '../public/Avatar.jpg';
import MovieAutocomplete from '../components/Autocomplete';

const Test = () => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked)
    }
    return (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="Button violet" size="large">
              Sign Up
            </button>
          </Dialog.Trigger>
      
          <Dialog.Portal>
            <Dialog.Overlay className={styles.DialogOverlay}>
              <Dialog.Content className={styles.DialogContent}>
                <Dialog.Title className={styles.DialogTitle}>Sign Up</Dialog.Title>
      
                <Dialog.Description className={styles.DialogDescription}>
                  Sign up here! Click the sign up button when you have entered your details.
                </Dialog.Description>
      
                <fieldset className={styles.Fieldset}>
                  <label className={styles.Label} htmlFor="username">
                    Username
                  </label>
                  <input className={styles.Input} id="username" placeholder="username" />
                </fieldset>
      
                <fieldset className={styles.Fieldset}>
                  <label className={styles.Label} htmlFor="password">
                    Password
                  </label>                     
                  <input className={styles.Input} id="password"  placeholder="password" type={handleClick}/>                
                </fieldset>
      
                <fieldset className={styles.Fieldset}>
                  <label className={styles.Label} htmlFor='confirmPassword'>
                    Confirm Password
                  </label>
                  <input className={styles.Input} id='confirmPassword'  placeholder='confirm password' />
                <button onClick={handleClick}>
                
                </button>
                </fieldset>
      
      
                <fieldset className={styles.Fieldset}>
                  <label className={styles.Label} htmlFor="email">
                    Email
                  </label>
                  <input className={styles.Input} id="email" placeholder="email" />
                </fieldset>
                
      
                <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
                  <Dialog.Close asChild>
                    <button className={styles.Button}>Sign Up</button>
                  </Dialog.Close>
                </div>
      
                <Dialog.Close asChild>
                  <button className={styles.IconButton} aria-label="Close"></button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
        );
 }

const fuckkk = () => { 
   
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
                                <textarea id ='reviewInput' className={styles.reviewInput} type='text'></textarea>
                
                        </form>
                    </div>
                    </div>
                ): null
            }

            </div>
        </div>
        ); 
    };

    export default Test