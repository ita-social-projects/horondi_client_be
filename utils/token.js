const jwt = require('jsonwebtoken');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  EMAIL_TOKEN_SECRET,
} = require('../dotenvValidator');

const generateAccessToken = payload => {
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET);
  return token;
};

const generateRefreshToken = payload => {
  const token = jwt.sign(payload, REFRESH_TOKEN_SECRET);
  return token;
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
