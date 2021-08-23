const bcrypt = require('bcryptjs');

class BcryptClient {
  static async hashPassword(password, saltRounds = 10) {
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = BcryptClient;
