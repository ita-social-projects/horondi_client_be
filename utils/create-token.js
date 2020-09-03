const jwt = require('jsonwebtoken');

const generateToken = async (userId, email, params) => {
  const options = !params
    ? { expiresIn: process.env.EXPIRES_IN }
    : params.EXPIRES_IN
      ? { expiresIn: params.EXPIRES_IN }
      : {};
  const token = await jwt.sign({ userId, email }, process.env.SECRET, options);
  return token;
};
module.exports = generateToken;
