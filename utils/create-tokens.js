const jwt = require('jsonwebtoken');
const {
  TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  SECRET,
} = require('../dotenvValidator');

const defaultParams = {
  expiresIn: TOKEN_EXPIRES_IN,
  secret: SECRET,
};

const generateTokens = (
  userId,
  withRefresh = false,
  params = defaultParams
) => {
  const expireTime = {
    expiresIn: params.expiresIn,
  };
  if (withRefresh) {
    const accesToken = jwt.sign({ userId }, params.secret, expireTime);
    const refreshToken = jwt.sign({ userId }, SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return { accesToken, refreshToken };
  } else {
    const accesToken = jwt.sign({ userId }, params.secret, expireTime);
    const refreshToken = null;
    return { accesToken, refreshToken };
  }
};
module.exports = generateTokens;
