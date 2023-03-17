import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "../styles/auth-form.module.css";
import {HiEye,HiEyeOff } from 'react-icons/hi';

async function createUser(email, username, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AuthFormSU() {
  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const router = useRouter();

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

    try {
      const result = await createUser(
        enteredEmail,
        enteredUsername,
        enteredPassword
      );
      console.log(result);
      router.push("/login");
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  }

  return (
    <section className={classes.auth}>
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            required
            ref={usernameInputRef}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password"> Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
          
        </div>
        <div className={classes.actions}>
          <button type="submit">Create account</button>
          <button
            className={classes.toggle}
            onClick={() => router.push("/login")}
          >
            Login as existing user
          </button>
        </div>
      </form>
    </section>
  );
}
///////LOG IN FORM////////

function AuthFormLI() {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const router = useRouter();

  async function submitHandler(event) {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

    const result = await signIn("credentials", {
      redirect: false,
      username: enteredUsername,
      password: enteredPassword,
      callbackUrl: '/',
    });

    if (result.ok) {
      //authorize();
      // set some auth state
      router.replace("/account");
    }
  }

  return (
    <section className={classes.auth}>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="username">Username</label>
          
          <input
            type="username"
            id="username"
            required
            ref={usernameInputRef}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password"> Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button type="submit">Log in</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={() => router.push("/signup")}
          >
            {"Don't have an account? Sign up here!"}
          </button>
        </div>
      </form>
    </section>
  );
}

export { AuthFormSU, AuthFormLI };
