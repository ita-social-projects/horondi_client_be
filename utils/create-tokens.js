const jwt = require('jsonwebtoken');
const {
  TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  SECRET,
} = require('../dotenvValidator');

const generateTokens = (userId, withRefresh) => {
  if (withRefresh) {
    const accesToken = jwt.sign({ userId }, SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId }, SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accesToken, refreshToken };
  } else {
    const accesToken = jwt.sign({ userId }, SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });
    const refreshToken = null;
    return { accesToken, refreshToken };
  }
};
module.exports = generateTokens;
