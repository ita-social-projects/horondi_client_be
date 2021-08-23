const bcrypt = require('bcryptjs');

class BcryptClient {
  static async hashPassword(password, saltRounds) {
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = BcryptClient;
