const jwt = require('jsonwebtoken');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

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
