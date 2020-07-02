const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const User = require('./user.model');
const {
  checkUserExist,
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validateUser');
const generateToken = require('../../utils/createToken');

class UserService {
  getAllUsers() {
    return User.find();
  }

  async getUserById(auth) {
    const user = await User.findById(auth.userId);

    await checkUserExist('_id', auth.userId);

    return user;
  }

  async updateUser({
    firstName, lastName, email, password,
  }, auth) {
    const { errors } = await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      password,
      email,
    });

    if (errors) {
      throw new UserInputError('Errors', { errors });
    }

    const user = await checkUserExist('_id', auth.userId);

    if (auth.email !== email) {
      const checkedUser = await User.findOne({ email });

      if (checkedUser) {
        const massage = 'User with provided email already exists';
        throw new UserInputError(massage, {
          errors: {
            email: massage,
          },
        });
      }
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const credentials = user.credentials.map(cred => {
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

    return User.findByIdAndUpdate(auth.userId, {
      ...user._doc,
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

    const user = await checkUserExist('email', email);

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass,
    );

    if (!match) {
      throw new AuthenticationError('Wrong password');
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
    return { ...savedUser._doc, id: savedUser._id };
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}
module.exports = new UserService();
