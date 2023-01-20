import Link from "next/link";
import React, {useState} from 'react';
import signStyle from '../styles/sign.module.css'
import Nav from "./Nav";


export  function PageWithJSbasedForm() {
    // Handles the submit event on form submit.
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    }
    const handleSubmit = async (event) => {
      // Stop the form from submitting and refreshing the page.
      event.preventDefault()
  
      // Get data from the form.
      const data = {
        userName: event.target.userName.value,
        password: event.target.password.value,
        email: event.target.email.value,
      }
  
      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify(data)
  
      // API endpoint where we send form data.
      const endpoint = '/api/form'
  
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      }
  
      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)
  
      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const result = await response.json()
      alert(`Is this your Username, Password and Email?: ${result.data}`)
    }
    return (
        <div>
            
        <button onClick={handleOpen} className={signStyle.buttons}>Sign Up</button>
        
        <div className={signStyle.dropdown}>
        {open ? (
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <label htmlFor='userName'>Username:</label>
                    <input type='text' id='userName'required></input>
                <label htmlFor='password'>Password:</label>
                    <input type='text' id='password' required></input>
                <label htmlFor='email'>Email:</label>
                    <input type='text'
                    id='email'
                     required
                    pattern="[a-z0-9]+@[a-z0-9]+{1-15}"
                    ></input>
                   
                <button type='submit'>Sign Up</button>
            </form>
        ): null}
        </div>
    </div>
    )
}


 export const Signup = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    }
    return (
        <div>
            
            <button onClick={handleOpen} className={signStyle.buttons}>Sign Up</button>
            
            <div className={signStyle.dropdown}>
            {open ? (
                <form onSubmit={PageWithJSbasedForm}>
                    <h1>Sign Up</h1>
                    <label htmlFor='userName'>Username:</label>
                        <input type='text' id='userName'required></input>
                    <label htmlFor='password'>Password:</label>
                        <input type='text' id='password' required></input>
                    <label htmlFor='email'>Email:</label>
                        <input type='text'
                        id='email'
                        htmlFor='email'
                         required
                        pattern="[a-z0-9]+@[a-z0-9]+{1-15}"
                        ></input>
                       
                    <button type='submit'>Sign Up</button>
                </form>
            ): null}
            </div>
        </div>
       
    )
}


export const Login = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    }
    return (
        <div>
            
            <button onClick={handleOpen} className={signStyle.buttons}>Log In</button>
            
            <div className={signStyle.dropdown}>
            {open ? (
                <form>
                    <h1>Log In</h1>
                    <label>Username:</label>
                        <input type='text'></input>
                    <label>Password:</label>
                        <input type='text'></input>
                       
                    <button type='submit'>Log In</button>
                </form>
            ): null}
            </div>
        </div>
       
    )
}


