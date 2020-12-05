const jwt = require('jsonwebtoken');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  EMAIL_TOKEN_SECRET,
  SECRET,
} = require('../dotenvValidator');

const generateAccessToken = payload => {
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET);
  return token;
};

const generateRefreshToken = payload => {
  const fields = {
    userId: payload._id,
    email: payload.email,
    isRefreshToken: true,
  };

  const options = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  };

  return jwt.sign(fields, SECRET, options);
};

const generateEmailToken = payload => {
  const token = jwt.sign(payload, EMAIL_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return token;
};

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  generateEmailToken,
};
