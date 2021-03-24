const jwt = require('jsonwebtoken');
const { EMAIL_TOKEN_SECRET } = require('../dotenvValidator');

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
