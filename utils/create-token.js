const jwt = require('jsonwebtoken');

const defaultParams = {
  expiresIn: process.env.EXPIRES_IN,
  secret: process.env.SECRET,
};

const generateToken = async (userId, email, params = defaultParams) => {
  const options = {
    expiresIn: params.expiresIn,
  };
  const { secret } = params;
  return jwt.sign({ userId, email }, secret, options);
};
module.exports = generateToken;
