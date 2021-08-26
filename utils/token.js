const jwt = require('jsonwebtoken');
const { EMAIL_TOKEN_SECRET } = require('../dotenvValidator');

const generateEmailToken = payload =>
  jwt.sign(payload, EMAIL_TOKEN_SECRET, {
    expiresIn: '1d',
  });

module.exports = {
  generateEmailToken,
};
