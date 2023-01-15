import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "../styles/radixSign.module.css";

export const RadixDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet" size="large">
        Edit profile
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
            <input className="Input" id="name" defaultValue="..." />
          </fieldset>

          <fieldset className={styles.Fieldset}>
            <label className={styles.Label} htmlFor="password">
              Password
            </label>
            <input className="Input" id="username" defaultValue="..." />
          </fieldset>

          <fieldset className={styles.Fieldset}>
            <label className={styles.Label} htmlFor="email">
              Email
            </label>
            <input className={styles.Input} id="email" defaultValue="..." />
          </fieldset>

          <div style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}>
            <Dialog.Close asChild>
              <button className={styles.button}>Sign Up</button>
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
