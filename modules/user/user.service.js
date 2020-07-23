const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
} = require('../../utils/validateUser');
const generateToken = require('../../utils/createToken');
const { sendEmail, confirmationMessage } = require('../../utils/sendmail');
const {
  CONFIRMATION_ERROR,
  TOKEN_NOT_VALID,
  NOT_CONFIRMED,
  WRONG_CREDENTIALS,
} = require('../../error-messages/user.messages');

class UserService {
  async checkUserExists(email) {
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

  async getUserByFieldOrThrow(key, param, customError) {
    const checkedUser = await User.findOne({ [key]: param });

    if (!checkedUser && !customError) {
      const message = `User with provided ${[key]} not found`;
      throw new UserInputError(message, {
        errors: {
          [key]: message,
        },
      });
    } else if (!checkedUser && customError) {
      throw new UserInputError(customError);
    }

    return checkedUser;
  }

  getAllUsers() {
    return User.find();
  }

  async getUser(id) {
    return this.getUserByFieldOrThrow('_id', id);
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
      throw new UserInputError('Errors', { errors });
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
      throw new UserInputError('Errors', { errors });
    }

    return User.findByIdAndUpdate(user._id, {
      firstName,
      lastName,
      email,
    });
  }

  async loginUser({ email, password }, language) {
    const { errors } = await validateLoginInput.validateAsync({
      email,
      password,
    });

    if (errors) {
      throw new UserInputError('Errors', { errors });
    }

    const user = await this.getUserByFieldOrThrow(
      'email',
      email,
      WRONG_CREDENTIALS[language].value,
    );

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass,
    );

    if (!match) {
      throw new AuthenticationError(WRONG_CREDENTIALS[language].value);
    }

    if (!user.confirmed) {
      return new Error(NOT_CONFIRMED[language].value);
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
    const token = await generateToken(savedUser._id, savedUser.email);
    const message = {
      from: `horondi.devproject@gmail.com`,
      to: savedUser.email,
      subject: 'Confirm Email',
      html: confirmationMessage(firstName, token),
    };
    await sendEmail(message);
    return savedUser;
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  async confirmUser(token, language) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return new Error(TOKEN_NOT_VALID[language].value);
      }
      user.confirmed = true;
      await User.findByIdAndUpdate(user._id, user);
      return true;
    } catch (e) {
      return new Error(CONFIRMATION_ERROR[language].value);
    }
  }
}
module.exports = new UserService();
