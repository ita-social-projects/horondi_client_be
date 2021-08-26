const jwt = require('jsonwebtoken');
const { SECRET } = require('../dotenvValidator');

const verifyUser = token => {
  if (!token) return;
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return '';
  }
};
module.exports = verifyUser;
