const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validateUser');
const generateToken = require('../../utils/createToken');

class UserService {
  async getUserExistByEmail(email) {
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

  async getUserOrThrow(key, param) {
    const checkedUser = await User.findOne({ [key]: param });

    if (!checkedUser) {
      const massage = `User with provided ${[key]} not found`;
      throw new UserInputError(massage, {
        errors: {
          [key]: massage,
        },
      });
    }

    return checkedUser;
  }

  getAllUsers() {
    return User.find();
  }

  async getUser(id) {
    const user = await User.findById(id);

    await this.getUserOrThrow('_id', id);

    return user;
  }

  async updateUser({
    firstName, lastName, email, password,
  }, id) {
    const { errors } = await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      email,
    });

    if (errors) {
      throw new UserInputError('Errors', { errors });
    }

    const user = await this.getUserOrThrow('_id', id);

    if (user._doc.email !== email) {
      await this.getUserExistByEmail(email);
    }

    const updatedUser = {
      firstName,
      lastName,
      email,
    };

    return User.findByIdAndUpdate(id, {
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

    const user = await this.getUserOrThrow('email', email);

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

    await this.getUserExistByEmail(email);

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
    return savedUser;
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}
module.exports = new UserService();
