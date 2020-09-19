const jwt = require('jsonwebtoken');
require('dotenv').config();

const defaultParams = {
  expiresIn: process.env.EXPIRES_IN,
  secret: process.env.SECRET,
};

const generateToken = async (userId, email, params = defaultParams) => {
  const options = {
    expiresIn: params.expiresIn,
  };
  return jwt.sign({ userId, email }, params.secret, options);
};
module.exports = generateToken;
