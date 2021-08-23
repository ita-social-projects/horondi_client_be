const JWTClient = require('./jwt-client');
const { REFRESH_TOKEN_EXPIRES_IN, SECRET } = require('../dotenvValidator');

const generateTokens = (userId, params, withRefresh = false) => {
  if (withRefresh) {
    const accessTokenWithRefresh = JWTClient.createToken(
      { userId },
      params.secret,
      params.expiresIn
    );
    const refreshTokenWithRefresh = JWTClient.createToken(
      { userId },
      SECRET,
      REFRESH_TOKEN_EXPIRES_IN
    );

    return {
      accessToken: accessTokenWithRefresh,
      refreshToken: refreshTokenWithRefresh,
    };
  }

  const accessToken = JWTClient.createToken(
    { userId },
    params.secret,
    params.expiresIn
  );
  const refreshToken = null;
  return { accessToken, refreshToken };
};

module.exports = generateTokens;
