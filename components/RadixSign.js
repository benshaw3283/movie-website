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
  



  
  return (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="bg-transparent hover:bg-slate-700 text-white hover:text-black font-semibold  py-2 px-4 border-2 border-slate-600 hover:border-black rounded">
        Sign Up
      </button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay}>
        
        <Dialog.Content className={styles.DialogContent}>


          <AuthFormSU/>
          


          <Dialog.Close asChild>
            <button className={styles.IconButton} aria-label="Close">X</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
  );
}



export const RadixDialogLog = () => {
  const ref = useRef('password')


  
  return (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="bg-transparent hover:bg-slate-700 text-white hover:text-black font-semibold  py-2 px-4 border-2 border-slate-600 hover:border-black rounded">
        Log In
      </button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay}>
        <Dialog.Content className={styles.DialogContent}>
          <Dialog.Title className={styles.DialogTitle}><strong>Log In</strong></Dialog.Title>
    
    <AuthFormLI/>
    <div style={{display: 'flex', justifyContent: 'space-around', position:'relative' , marginBottom: 4}}>
          <button onClick={()=> signIn('google')} >
            <Image src={googleIcon} alt='googleIcon'/>
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

