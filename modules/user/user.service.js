const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
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

  getUserById(id, auth) {
    if (auth.errors) throw new Error(auth.errors);
    return User.findById(id);
  }

  async updateUser(id, {
    firstName, lastName, email, password,
  }, auth) {
    if (auth.errors) throw new Error(auth.errors);

    const checkedUser = await User.findOne({ email });

    if (!checkedUser) {
      const massage = 'User with provided email not found';
      throw new UserInputError(massage, {
        errors: {
          email: massage,
        },
      });
    }

    const { errors } = await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      password,
      email,
    });

    if (errors) {
      throw new UserInputError('Errors', { errors });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const credentials = checkedUser.credentials.map(cred => {
      if (cred.source === 'horondi') {
        return {
          _id: cred._id,
          source: cred.source,
          tokenPass: encryptedPassword,
        };
      }
      return cred;
    });

    const updatedUser = {
      firstName,
      lastName,
      email,
      credentials,
    };

    return User.findByIdAndUpdate(id, {
      ...checkedUser._doc,
      ...updatedUser,
    });
  }

  async loginUser({ email, password }) {
    const { errors } = await validateLoginInput.validateAsync({
      email,
      password,
    });

    if (errors) {
      throw new UserInputError('Errors', { errors });
    }

    const user = await User.findOne({ email });

    if (!user) {
      errors.general = 'User not found';
      throw new UserInputError(errors.general, { errors });
    }

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass,
    );

    if (!match) {
      errors.general = 'Wrong password';
      throw new AuthenticationError(errors.general, { errors });
    }

    const token = generateToken(user._id, user.email);

    return {
      user: { ...user._doc },
      id: user._id,
      token,
    };
  }

  async registerUser({
    firstName, lastName, email, password,
  }) {
    const { errors } = await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      email,
      password,
    });

    if (errors) {
      throw new UserInputError('Errors', { errors });
    }

    const checkedUser = await User.findOne({ email });

    if (checkedUser) {
      const massage = 'User with provided email already exists';
      throw new UserInputError(massage, {
        errors: {
          email: massage,
        },
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      credentials: [
        {
          source: 'horondi',
          tokenPass: encryptedPassword,
        },
      ],
    });
    const savedUser = await user.save();
    return savedUser._doc;
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}
module.exports = new UserService();
