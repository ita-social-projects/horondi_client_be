const jwt = require('jsonwebtoken');
const { REFRESH_TOKEN_EXPIRES_IN, SECRET } = require('../dotenvValidator');

const generateTokens = (userId, params, withRefresh = false) => {
  if (withRefresh) {
    const accessTokenWithRefresh = jwt.sign({ userId }, params.secret, {
      expiresIn: params.expiresIn,
    });
    const refreshTokenWithRefresh = jwt.sign({ userId }, SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return {
      accessToken: accessTokenWithRefresh,
      refreshToken: refreshTokenWithRefresh,
    };
  }
  const accessToken = jwt.sign({ userId }, params.secret, {
    expiresIn: params.expiresIn,
  });
  const refreshToken = null;
  return { accessToken, refreshToken };
};
module.exports = generateTokens;
