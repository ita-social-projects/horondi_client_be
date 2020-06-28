const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const verifyUser = token => {
  if (!token) return;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (err) {
    throw new Error(err);
  }
};
module.exports = verifyUser;
