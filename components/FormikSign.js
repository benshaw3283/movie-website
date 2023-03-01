import React, { useState } from "react";
import { useFormik } from "formik";
import { signUp_validate, logIn_validate } from "../lib/validate";
import styles from "../styles/radixSign.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const FormikSignUp = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      cpassword: "",
    },
    validate: signUp_validate,
    onSubmit,
  });

  async function onSubmit(values) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };
    await fetch("http://localhost:3000/api/auth/signup", options)
      .then((res) => res.json())
      .then((data) => {
        if (data) router.push("http://localhost:3000");
      });
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div
        className={`${styles.Fieldset} ${
          formik.errors.email && formik.touched.email ? "border-rose-600" : ""
        }`}
      >
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          className={styles.Input}
          onChange={formik.handleChange}
          value={formik.values.email}
          {...formik.getFieldProps("email")}
        />
      </div>

      <div
        className={`${styles.Fieldset} ${
          formik.errors.username && formik.touched.username
            ? "border-rose-600"
            : ""
        }`}
      >
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="username"
          className={styles.Input}
          onChange={formik.handleChange}
          value={formik.values.username}
          {...formik.getFieldProps("username")}
        />
      </div>

      <div
        className={`${styles.Fieldset} ${
          formik.errors.password && formik.touched.password
            ? "border-rose-600"
            : ""
        }`}
      >
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.Input}
          onChange={formik.handleChange}
          value={formik.values.password}
          {...formik.getFieldProps("password")}
        />
      </div>

      <div
        className={`${styles.Fieldset} ${
          formik.errors.cpassword && formik.touched.cpassword
            ? "border-rose-600"
            : ""
        }`}
      >
        <label htmlFor="cpassword">Confirm Password</label>
        <input
          id="cpassword"
          name="cpassword"
          type="password"
          className={styles.Input}
          onChange={formik.handleChange}
          value={formik.values.cpassword}
          {...formik.getFieldProps("cpassword")}
        />
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
};

const FormikLogIn = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: logIn_validate,
    onSubmit: onSubmit,
  });

  async function onSubmit(values) {
    const _status = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
      callbackUrl: "/",
    });
    if (_status.ok) router.push(_status.url);
  }

  
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        type="username"
        onChange={formik.handleChange}
        value={formik.values.username}
        {...formik.getFieldProps("username")}
      />
      <span>
        {formik.errors.username && formik.touched.username ? (
          <span>{formik.errors.username}</span>
        ) : (
          <></>
        )}
      </span>

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        {...formik.getFieldProps("password")}
      />
      <span>
        {formik.errors.password && formik.touched.password ? (
          <span>{formik.errors.password}</span>
        ) : (
          <></>
        )}
      </span>
      <button type="submit">Log In</button>
    </form>
  );
};

export { FormikSignUp, FormikLogIn };
