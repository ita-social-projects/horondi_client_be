const JWTClient = require('./jwt-client');
const { SECRET } = require('../dotenvValidator');

const verifyUser = token => {
  if (!token) return;
  try {
    return JWTClient.decodeToken(token, SECRET);
  } catch (err) {
    return '';
  }
};
module.exports = verifyUser;
