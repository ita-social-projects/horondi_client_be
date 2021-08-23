const jwt = require('jsonwebtoken');

class JWTClient {
  static createToken(payload, secret, expiresIn = 0) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static decodeToken(token, secret) {
    return jwt.verify(token, secret);
  }
}

module.exports = JWTClient;
