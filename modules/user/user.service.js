const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
} = require('../../utils/validateUser');
const generateToken = require('../../utils/createToken');

class UserService {
  async checkUserExists(email) {
    const checkedUser = await User.findOne({
      email,
    });

    if (checkedUser) {
      const massage = [
        {
          lang: 'uk',
          value: `Користувач з таким емейлом вже зареєстрований`,
        },
        {
          lang: 'eng',
          value: 'User with provided email already exists',
        },
      ];
      throw new UserInputError(massage, {
        errors: {
          email: massage,
        },
      });
    }
  }

  async getUserByFieldOrThrow(key, param) {
    const checkedUser = await User.findOne({
      [key]: param,
    });

    if (!checkedUser) {
      const message = [
        {
          lang: 'uk',
          value: `Користувач з данним ${[key]} не знайдений`,
        },
        {
          lang: 'eng',
          value: `User with provided ${[key]} not found`,
        },
      ];
      throw new UserInputError(message, {
        errors: {
          [key]: message,
        },
      });
    }

    return checkedUser;
  }

  async getAllUsers() {
    const user = await User.find();
    return user;
  }

  async getUser(id) {
    return await this.getUserByFieldOrThrow('_id', id);
  }

  async updateUserById({
    firstName, lastName, email, password,
  }, id) {
    const { errors } = await validateUpdateInput.validateAsync({
      firstName,
      lastName,
      email,
    });

    if (errors) {
      throw new UserInputError('Errors', {
        errors,
      });
    }

    const user = await this.getUserByFieldOrThrow('_id', id);

    if (user._doc.email !== email) {
      await this.checkUserExists(email);
    }

    return User.findByIdAndUpdate(user._id, {
      firstName,
      lastName,
      email,
    });
  }

  async updateUserByToken({ firstName, lastName, email }, user) {
    const { errors } = await validateUpdateInput.validateAsync({
      firstName,
      lastName,
      email,
    });

    if (errors) {
      throw new UserInputError('Errors', {
        errors,
      });
    }

    return User.findByIdAndUpdate(user._id, {
      firstName,
      lastName,
      email,
    });
  }

  async loginUser({ email, password }) {
    const { errors } = await validateLoginInput.validateAsync({
      email,
      password,
    });

    if (errors) {
      throw new UserInputError('Errors', {
        errors,
      });
    }

    const user = await this.getUserByFieldOrThrow('email', email);

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass,
    );

    if (!match) {
      throw new AuthenticationError(`${[
        {
          lang: 'uk',
          value: `Невірний пароль`,
        },
        {
          lang: 'eng',
          value: `Wrong password`,
        },
      ]}`);
    }

    const token = generateToken(user._id, user.email);

    return {
      user: {
        ...user._doc,
      },
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
      throw new UserInputError('Errors', {
        errors,
      });
    }

    await this.checkUserExists(email);

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
