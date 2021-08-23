const JWTClient = require('./jwt-client');
const { EMAIL_TOKEN_SECRET } = require('../dotenvValidator');

const generateEmailToken = payload =>
  JWTClient.createToken(payload, EMAIL_TOKEN_SECRET, {
    expiresIn: '1d',
  });

module.exports = {
  generateEmailToken,
};
