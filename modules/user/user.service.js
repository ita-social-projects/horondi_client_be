const User = require('./user.model');

class UserService {
  getAllUsers() {
    return User.find();
  }

  getUserById(id) {
    return User.findById(id);
  }

  updateUser(id, user) {
    return User.findByIdAndUpdate(id, user);
  }

  addUser(data) {
    const user = new User(data);
    return user.save();
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}
module.exports = new UserService();
