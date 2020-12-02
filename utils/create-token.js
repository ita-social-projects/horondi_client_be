const jwt = require('jsonwebtoken');
const { TOKEN_EXPIRES_IN, SECRET } = require('../dotenvValidator');

const defaultParams = {
  expiresIn: TOKEN_EXPIRES_IN,
  secret: SECRET,
};

const generateToken = (userId, email, params = defaultParams) => {
  const options = {
    expiresIn: params.expiresIn,
  };
  return jwt.sign({ userId, email }, params.secret, options);
};
module.exports = generateToken;
