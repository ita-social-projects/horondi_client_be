const jwt = require('jsonwebtoken');
const {
  REFRESH_TOKEN_EXPIRES_IN,
  SECRET,
  TOKEN_EXPIRES_IN,
} = require('../dotenvValidator');

class JWTClient {
  constructor(userId = '') {
    this.userId = userId;
  }

  generateAccessToken(secret, expiresIn) {
    return JWTClient.createToken(
      { userId: this.userId },
      secret || SECRET,
      expiresIn || TOKEN_EXPIRES_IN
    );
  }

  generateRefreshToken(secret, expiresIn) {
    return JWTClient.createToken(
      { userId: this.userId },
      secret || SECRET,
      expiresIn || REFRESH_TOKEN_EXPIRES_IN
    );
  }

  generateTokens({ secret, expiresIn }) {
    return {
      accessToken: this.generateAccessToken(secret, expiresIn),
      refreshToken: this.generateRefreshToken(),
    };
  }

  static createToken(payload, secret, expiresIn = 0) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static decodeToken(token, secret) {
    if (!token) return;
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return '';
    }
  }
}

module.exports = JWTClient;
