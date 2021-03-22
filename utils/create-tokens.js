const jwt = require('jsonwebtoken');
const { REFRESH_TOKEN_EXPIRES_IN, SECRET } = require('../dotenvValidator');

const generateTokens = (userId, params, withRefresh = false) => {
  if (withRefresh) {
    const accesToken = jwt.sign({ userId }, params.secret, {
      expiresIn: params.expiresIn,
    });
    const refreshToken = jwt.sign({ userId }, SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accesToken, refreshToken };
  } else {
    const accesToken = jwt.sign({ userId }, params.secret, {
      expiresIn: params.expiresIn,
    });
    const refreshToken = null;
    return { accesToken, refreshToken };
  }
};
module.exports = generateTokens;
