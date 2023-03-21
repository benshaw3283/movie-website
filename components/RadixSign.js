import React, {useState, useRef, useEffect} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "../styles/radixSign.module.css";
import { useSession, signIn, signOut } from 'next-auth/react'
import googleIcon from '../public/googleIcon.png'
import facebookIcon from '../public/facebookIcon.png'
import Image from "next/image";
import { AuthFormLI, AuthFormSU } from "./AuthForm";


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
      <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        Sign Up
      </button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay}>
        <Dialog.Content className={styles.DialogContent}>


          <AuthFormSU/>
          


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
      <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        Log In
      </button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay}>
        <Dialog.Content className={styles.DialogContent}>
          <Dialog.Title className={styles.DialogTitle}><strong>Log In</strong></Dialog.Title>
    
    <AuthFormLI/>
    <div style={{display: 'flex', justifyContent: 'space-around', position:'relative'}}>
          <button onClick={()=> signIn('google')} >
            <Image src={googleIcon} alt='googleIcon'/>
          </button>

          <button onClick={()=> signIn('facebook')}>
            <Image src={facebookIcon} alt='facebookIcon'/>
          </button>
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

