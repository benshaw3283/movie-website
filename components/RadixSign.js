import React, {useState, useRef, useEffect} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "../styles/radixSign.module.css";
import { useSession, signIn, signOut } from 'next-auth/react'
import googleIcon from '../public/googleSign.png'

import Image from "next/image";
import { AuthFormLI, AuthFormSU } from "./AuthForm";


export const RadixDialogSign = () => {
 const [open, setOpen] = useState(false)

  
  
  return (
  <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>
      <button className="bg-transparent hover:bg-slate-700 text-white hover:text-black font-semibold   border-2 border-slate-600 hover:border-black rounded w-20 h-fit py-2">
        Sign Up
      </button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className={styles.DialogOverlay}>
        
        <Dialog.Content className={styles.DialogContent}>


          <AuthFormSU closeOnSuccess={( ) => setOpen(false)}/>
          


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
      <button className="bg-transparent hover:bg-slate-700 text-white hover:text-black font-semibold  py-2 border-2 border-slate-600 hover:border-black rounded w-20">
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
            <button className={styles.IconButton} aria-label="Close">X</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
  );
}

