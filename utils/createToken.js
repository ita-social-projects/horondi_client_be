const jwt = require('jsonwebtoken');

const generateToken = async (userId, email) => {
  const token = await jwt.sign({ userId, email }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
  return token;
};
module.exports = generateToken;
