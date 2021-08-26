const jwt = require('jsonwebtoken');
const {
  REFRESH_TOKEN_EXPIRES_IN,
  SECRET,
  TOKEN_EXPIRES_IN,
} = require('../dotenvValidator');

class JWTClient {
  constructor(userId) {
    this.userId = userId;
  }

  setData(data) {
    this.userId = data.userId;
  }

  generateAccessToken(secret, expiresIn) {
    return this.createToken(
      { userId: this.userId },
      secret || SECRET,
      expiresIn || TOKEN_EXPIRES_IN
    );
  }

  generateRefreshToken(secret, expiresIn) {
    return this.createToken(
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

  createToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  decodeToken(token, secret) {
    let decoded = '';
    if (!token) return decoded;
    try {
      decoded = jwt.verify(token, secret);
      return decoded;
    } catch (err) {
      return decoded;
    }
  }
}

module.exports = {
  jwtClient: new JWTClient(),
  JWTClient,
};
