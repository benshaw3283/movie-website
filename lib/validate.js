
const signUp_validate = values => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Required';
    } else if (values.username.length > 15) {
      errors.username = 'Must be 15 characters or less';
    }
  
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length <7 || values.password.length> 20) {
      errors.password = 'Must be between 7 and 20 characters in length';
    }
  
    if (!values.cpassword) {
      errors.cpassword = 'Required';
    } else if (values.cpassword !== values.password) {
        errors.cpassword = 'Passwords do not match'
      }
  
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
  
    return errors;
  };

  const logIn_validate = values => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Required';
    } else if (values.username.length > 15) {
      errors.username = 'Must be 15 characters or less';
    }
  
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length <7 || values.password.length> 20) {
      errors.password = 'Must be between 7 and 20 characters in length';
    }
  
    return errors;
  };

  export {signUp_validate, logIn_validate};