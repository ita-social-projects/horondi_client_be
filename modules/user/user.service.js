const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
} = require('../../utils/validateUser');
const generateToken = require('../../utils/createToken');
const { sendEmail } = require('../../utils/sendmail');
const {
  confirmationMessage,
  recoveryMessage,
} = require('../../utils/localization');

const {
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  INPUT_NOT_VALID,
  WRONG_CREDENTIALS,
} = require('../../error-messages/user.messages');

class UserService {
  async checkUserExists(email) {
    const checkedUser = await User.findOne({ email });

    if (checkedUser) {
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
    }
  }

  async getUserByFieldOrThrow(key, param) {
    const checkedUser = await User.findOne({ [key]: param });

    if (!checkedUser) {
      throw new UserInputError(USER_NOT_FOUND, { key, statusCode: 400 });
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
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    const user = await this.getUserByFieldOrThrow('_id', id);
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
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
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
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    const user = await this.getUserByFieldOrThrow('email', email);

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass,
    );

    if (!match) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
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
  }, language) {
    const { errors } = await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      email,
      password,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
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
    const token = await generateToken(savedUser._id, savedUser.email, {
      EXPIRES_IN: undefined,
    });
    const message = {
      from: process.env.MAIL_USER,
      to: savedUser.email,
      subject: 'Confirm Email',
      html: confirmationMessage(firstName, token, language),
    };
    await sendEmail(message);
    return savedUser;
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  async confirmUser(token) {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new UserInputError(USER_NOT_FOUND, { statusCode: 400 });
    }
    user.confirmed = true;
    await User.findByIdAndUpdate(user._id, user);
    return true;
  }

  async recoverUser(email, language) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UserInputError(USER_NOT_FOUND, { statusCode: 404 });
    }
    const token = await generateToken(user._id, user.email, {
      EXPIRES_IN: process.env.RECOVERY_EXPIRE,
    });
    const message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Recovery Instructions',
      html: recoveryMessage(user.firstName, token, language),
    };
    await sendEmail(message);
    return true;
  }
}
module.exports = new UserService();
