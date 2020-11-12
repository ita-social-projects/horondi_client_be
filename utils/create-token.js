const jwt = require('jsonwebtoken');
const { EXPIRES_IN, SECRET } = require('../dotenvValidator');

const defaultParams = {
  expiresIn: EXPIRES_IN,
  secret: SECRET,
};

const generateToken = async (userId, email, params = defaultParams) => {
  const options = {
    expiresIn: params.expiresIn,
  };
  return jwt.sign({ userId, email }, params.secret, options);
};
module.exports = generateToken;
