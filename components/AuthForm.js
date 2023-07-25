import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "../styles/auth-form.module.css";
import { HiEye, HiEyeOff } from "react-icons/hi";

async function createUser(email, username, password) {

  try {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}catch(err){
  console.log(err)
}
}

function AuthFormSU(props) {
  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const cpasswordInputRef = useRef();

  const [show, setShow] = useState(false);
  const [cshow, setCshow] = useState(false);

  const router = useRouter();

  async function submitHandler() {
    

    const enteredEmail = emailInputRef.current.value;
    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredCpassword = cpasswordInputRef.current.value;

    if (enteredCpassword !== enteredPassword) {
      alert("Password confirmation unsuccessful");
    } else {
      try {
        const result = await createUser(
          enteredEmail,
          enteredUsername,
          enteredPassword
        );
        if (result) {
          props.closeOnSuccess;
          
          router.push("/login");
        }
      } catch (error) {
        alert("Unable to create account: " + error.message);
        router.push("/signup");
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1 className="text-xl font-semibold underline">Sign Up</h1>
      <br></br>
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
            placeholder="Minimum 3 characters"
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password"> Password</label>
          <div className="flex items-center justify-end">
            <input
              type={`${show ? "text" : "password"}`}
              id="password"
              required
              ref={passwordInputRef}
              placeholder="Minimum 5 characters"
            />
            <span className="absolute pr-2">
              {!show ? (
                <HiEye
                  onClick={() => setShow(!show)}
                  className="cursor-pointer"
                />
              ) : (
                <HiEyeOff
                  onClick={() => setShow(!show)}
                  className="cursor-pointer"
                />
              )}
            </span>
          </div>
        </div>
        <div className={classes.control}>
          <label htmlFor="cpassword">Confirm Password</label>
          <div className="flex items-center justify-end">
            <input
              type={`${cshow ? "text" : "password"}`}
              id="cpassword"
              required
              ref={cpasswordInputRef}
            />
            <span className="absolute pr-2">
              {!cshow ? (
                <HiEye
                  onClick={() => setCshow(!cshow)}
                  className="cursor-pointer"
                />
              ) : (
                <HiEyeOff
                  onClick={() => setCshow(!cshow)}
                  className="cursor-pointer"
                />
              )}
            </span>
          </div>
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
  const [show, setShow] = useState(false);

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
      callbackUrl: "/",
    });

    if (result.ok) {
      //authorize();
      // set some auth state
      router.replace("/");
    } else {
      alert("No user found with these details");
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
          <div className="flex items-center justify-end">
            <input
              type={`${show ? "text" : "password"}`}
              id="password"
              required
              ref={passwordInputRef}
            />
            <span className="absolute pr-2">
              {!show ? (
                <HiEye
                  onClick={() => setShow(!show)}
                  className="cursor-pointer"
                />
              ) : (
                <HiEyeOff
                  onClick={() => setShow(!show)}
                  className="cursor-pointer"
                />
              )}
            </span>
          </div>
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
