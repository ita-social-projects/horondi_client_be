const jwt = require('jsonwebtoken');
const { SECRET } = require('../dotenvValidator');
const verifyUser = token => {
  if (!token) return;
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    return false;
  }
};
module.exports = verifyUser;
