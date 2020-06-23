const { AuthenticationError } = require('apollo-server');
const User = require('./user.model');

class UserService {
  getAllUsers() {
    return User.find();
  }

  getUserById(id, data) {
    const { token } = data.headers || data.cookies || '';
    if (!token) {
      throw new AuthenticationError(JSON.stringify({ message: 'no token' }));
    }
    return User.findById(id);
  }

  updateUser(id, user) {
    return User.findByIdAndUpdate(id, user);
  }

  async addUser(data) {
    const {
      firstname, lastname, email, credentials,
    } = data;

    const checkedUser = await User.find({ email });

    if (checkedUser) {
      return { message: 'user already exist' };
    }
    const user = new User({
      firstname,
      lastname,
      email,
    });
    await user.save();
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}
module.exports = new UserService();
