const jwt = require('jsonwebtoken');
const { REFRESH_TOKEN_EXPIRES_IN, SECRET } = require('../dotenvValidator');

const generateTokens = (userId, params, withRefresh = false) => {
  if (withRefresh) {
    const accessToken = jwt.sign({ userId }, params.secret, {
      expiresIn: params.expiresIn,
    });
    const refreshToken = jwt.sign({ userId }, SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accessToken, refreshToken };
  }
  const accessToken = jwt.sign({ userId }, params.secret, {
    expiresIn: params.expiresIn,
  });
  const refreshToken = null;
  return { accessToken, refreshToken };
};
module.exports = generateTokens;
