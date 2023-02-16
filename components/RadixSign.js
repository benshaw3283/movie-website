import React, {useState, useRef, useEffect} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "../styles/radixSign.module.css";
import { CheckboxPassword } from "./RadixComponents";
import { red } from "@radix-ui/colors";
import { useSession, signIn, signOut } from 'next-auth/react'
import { grey } from "@material-ui/core/colors";
import googleIcon from '../public/googleIcon.png'
import facebookIcon from '../public/facebookIcon.png'
import Image from "next/image";


export const RadixDialogSign = () => {
  const ref = useRef('password')
  

////////NOT WORKING RIGHT////////
  const handleClick = () => {
      if (ref.current === 'password') {
        ref.current.setAttribute('type','text')
      } else {
        ref.current.setAttribute('type','password')
      }         
  }
////////

  
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
            <input className={styles.Input} id="password"  ref={ref} placeholder="password" type={handleClick}/>
            <button onClick={handleClick} >
              <CheckboxPassword/>
              </button>                
          </fieldset>

          <fieldset className={styles.Fieldset}>
            <label className={styles.Label} htmlFor='confirmPassword'>
              Confirm Password
            </label>
            <input className={styles.Input} id='confirmPassword' ref={ref} placeholder='confirm password' type={handleClick}/>
          <button onClick={handleClick}>
            <CheckboxPassword />
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



export const RadixDialogLog = () => {
  const ref = useRef('password')

////////NOT WORKING////////
  const handleClick = () => {
      if (ref.current === 'password') {
        ref.current.setAttribute('type','text')
      } else {
        ref.current.setAttribute('type','password')
      }         
  }
////////

  
  return (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet" size="large">
        Log In
      </button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay}>
        <Dialog.Content className={styles.DialogContent}>
          <Dialog.Title className={styles.DialogTitle}><strong>Log In</strong></Dialog.Title>
    <br></br>
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
            <input className={styles.Input} id="password"  ref={ref} placeholder="password" type={handleClick}/>
            <button onClick={handleClick} >
              <CheckboxPassword/>
              </button>  
     
            
          </fieldset>   

          <div>
             <p style={{color: "black", justifyContent: 'space-around', position: 'relative', display: 'flex'}}>================ OR ================</p>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-around', position:'relative'}}>
          <button onClick={()=> signIn('google')} >
            <Image src={googleIcon} alt='googleIcon'/>
          </button>

          <button onClick={()=> signIn('facebook')}>
            <Image src={facebookIcon} alt='facebookIcon'/>
          </button>
          </div>

          <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <button className={styles.Button}>Log In</button>
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

