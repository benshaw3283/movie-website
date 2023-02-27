import React, {useState} from 'react';
import { useFormik } from 'formik';
import validate from '../lib/validate';



const FormikSignUp = () => {

  const formik = useFormik({
    initialValues: {
      email:'',
      username: '',
      password: '',
      cpassword: ''
    },
    validate : validate,
    onSubmit: onSubmit,
  })

  async function onSubmit(values){
    alert(values);
  }

  return (
    <form onSubmit={formik.handleSubmit}>

      <label htmlFor="email">Email Address</label>
       <input
         id="email"
         name="email"
         type="email"
         onChange={formik.handleChange}
         value={formik.values.email}
         {...formik.getFieldProps('email')}
       />
      <span>
        {formik.errors.email && formik.touched.email ? <span>{formik.errors.email}</span> : <></>}
      </span>

<label htmlFor="username">Username</label>
       <input
         id="username"
         name="username"
         type="username"
         onChange={formik.handleChange}
         value={formik.values.username}
         {...formik.getFieldProps('username')}
       />
       <span>
        {formik.errors.username && formik.touched.username ? <span>{formik.errors.username}</span> : <></>}
      </span>

<label htmlFor="password">Password</label>
       <input
         id="password"
         name="password"
         type="password"
         onChange={formik.handleChange}
         value={formik.values.password}
         {...formik.getFieldProps('password')}
       />
      <span>
        {formik.errors.password && formik.touched.password ? <span>{formik.errors.password}</span> : <></>}
      </span>


<label htmlFor="cpassword">Confirm Password</label>
       <input
         id="cpassword"
         name="cpassword"
         type="password"
         onChange={formik.handleChange}
         value={formik.values.cpassword}
         {...formik.getFieldProps('cpassword')}
       />
      <span>
        {formik.errors.cpassword && formik.touched.cpassword ? <span>{formik.errors.cpassword}</span> : <></>}
      </span>

      <button type="submit">Sign Up</button>
    </form>
                         
  )
}

export default FormikSignUp;
