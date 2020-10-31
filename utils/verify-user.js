const jwt = require('jsonwebtoken');

const verifyUser = token => {
  if (!token) return;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (err) {
    return false;
  }
};
module.exports = verifyUser;
