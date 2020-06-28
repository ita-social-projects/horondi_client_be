module.exports.validateRegisterInput = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
) => {
  const errors = {};

  if (firstName.trim() === '') {
    errors.firstName = 'This field is required. Please write your first name';
  }
  if (lastName.trim() === '') {
    errors.lastName = 'This field is required. Please write your last name';
  }
  if (email.trim() === '') {
    errors.email = 'This field is required. Please write your email';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password === '') {
    errors.password = 'This field is required. Please write password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === '') {
    errors.email = 'This field is required. Please write your email';
  }
  if (password.trim() === '') {
    errors.password = 'This field is required. Please write your password';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
