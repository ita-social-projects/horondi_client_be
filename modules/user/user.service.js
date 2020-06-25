const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validateUser');
const generateToken = require('../../utils/createToken');

class UserService {
  getAllUsers() {
    return User.find();
  }

  getUserById(id, data) {
    const { token } = data.headers || data.cookies || '';
    if (!token) {
      throw new AuthenticationError(JSON.stringify({ message: 'no token' }));
    }
    const decoded = jwt.verify(data.headers.token, process.env.SECRET);
    if (decoded) return User.findById(id);
    throw new AuthenticationError(
      JSON.stringify({ message: 'Token is not valid' }),
    );
  }

  updateUser(id, user) {
    return User.findByIdAndUpdate(id, user);
  }

  async loginUser({ email, password }) {
    const { errors, valid } = validateLoginInput(email, password);

    if (!valid) {
      throw new UserInputError('Errors', { errors });
    }

    const user = await User.findOne({ email });

    if (!user) {
      errors.general = 'User not found';
      throw new UserInputError('User not found', { errors });
    }

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass,
    );
    if (!match) {
      errors.general = 'Wrong crendetials';
      throw new UserInputError('Wrong crendetials', { errors });
    }

    const token = generateToken(user._id, user.firstName);

    return {
      ...user._doc,
      id: user._id,
      token,
    };
  }

  async registerUser({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }) {
    const { valid, errors } = validateRegisterInput(
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    );

    if (!valid) {
      throw new UserInputError('Errors', { errors });
    }

    const checkedUser = await User.findOne({ email });

    if (checkedUser) {
      throw new UserInputError('User already exist', {
        errors: {
          email: 'This email already taken',
        },
      });
    }

    const bycryptPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      credentials: [
        {
          source: 'horondi',
          tokenPass: bycryptPassword,
        },
      ],
    });
    const res = await user.save();
    return { ...res._doc };
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}
module.exports = new UserService();
