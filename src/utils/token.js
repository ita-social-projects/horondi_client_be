const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = payload => {
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
  return token;
};

const generateRefreshToken = payload => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

const generateEmailToken = payload => {
  const token = jwt.sign(payload, process.env.EMAIL_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return token;
};

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  generateEmailToken,
};
