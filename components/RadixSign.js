import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import '../styles/radixSign.module.css'
import { Cross2Icon } from '@radix-ui/react-icons';


export const RadixDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet" size="large">
        Edit profile
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Sign Up</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Sign up here! Click the sign up button when you have entered your details.
        </Dialog.Description>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="username">
            Username
          </label>
          <input className="Input" id="name" defaultValue="..." />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="password">
            Password
          </label>
          <input className="Input" id="username" defaultValue="..." />
        </fieldset>
        <fieldset className='Fieldset'>
          <label className='Label' htmlFor='email'>
            Email 
          </label>
          <input className='Input' id='email' defaultValue='...' />
        </fieldset>
        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <button className="Button green">Sign Up</button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
