const bcrypt = require('bcryptjs');

class BcryptClient {
  async hashPassword(password, saltRounds) {
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = {
  bcryptClient: new BcryptClient(),
  BcryptClient,
};
