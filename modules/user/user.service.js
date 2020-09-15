const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
  validateNewPassword,
  validateSendConfirmation,
} = require('../../utils/validate-user');
const generateToken = require('../../utils/create-token');
const { sendEmail } = require('../../utils/sendGrid-email');
const {
  confirmationMessage,
  recoveryMessage,
} = require('../../utils/localization');
const { uploadFiles } = require('../upload/upload.service');

const {
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  INPUT_NOT_VALID,
  WRONG_CREDENTIALS,
  INVALID_PERMISSIONS,
  PASSWORD_RECOVERY_ATTEMPTS_LIMIT_EXCEEDED,
  RESET_TOKEN_NOT_VALID,
  AUTHENTICATION_TOKEN_NOT_VALID,
  USER_EMAIL_ALREADY_CONFIRMED,
} = require('../../error-messages/user.messages');

const ROLES = {
  user: 'user',
  admin: 'admin',
};

const SOURCES = {
  horondi: 'horondi',
};

class UserService {
  async checkIfTokenIsValid(token) {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await this.getUserByFieldOrThrow('email', decoded.email);

    if (user.recoveryToken !== token) {
      throw new UserInputError(AUTHENTICATION_TOKEN_NOT_VALID, { statusCode: 400 });
    }
    return true;
  }

  async getUserByFieldOrThrow(key, param) {
    const checkedUser = await User.findOne({
      [key]: param,
    });

    if (!checkedUser) {
      throw new UserInputError(USER_NOT_FOUND, { key, statusCode: 400 });
    }

    return checkedUser;
  }

  async getAllUsers() {
    return await User.find();
  }

  async getUser(id) {
    return this.getUserByFieldOrThrow('_id', id);
  }

  async updateUserById(updatedUser, id, upload) {
    const { firstName, lastName, email } = updatedUser;

    const { errors } = await validateUpdateInput.validateAsync({
      firstName,
      lastName,
      email,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    const user = await this.getUserByFieldOrThrow('_id', id);

    if (user._doc.email !== updatedUser.email) {
      const user = await this.getUserByFieldOrThrow('email', updatedUser.email);
      if (user) {
        throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
      }
    }

    if (upload) {
      const uploadResult = await uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      updatedUser.images = imageResults.fileNames;
    }

    return User.findByIdAndUpdate(id, updatedUser, { new: true });
  }

  async updateUserByToken(updatedUser, user) {
    const { firstName, lastName, email } = updatedUser;

    const { errors } = await validateUpdateInput.validateAsync({
      firstName,
      lastName,
      email,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    return User.findByIdAndUpdate(
      user._id,
      {
        ...user._doc,
        ...updatedUser,
      },
      { new: true },
    );
  }

  async loginAdmin({ email, password }) {
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
      user.credentials.find(cred => cred.source === SOURCES.horondi).tokenPass,
    );

    if (user.role === ROLES.user) {
      throw new UserInputError(INVALID_PERMISSIONS, { statusCode: 400 });
    }

    if (!match) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
    }

    const token = generateToken(user._id, user.email);

    return {
      user: {
        ...user._doc,
      },
      _id: user._id,
      token,
    };
  }

  async loginUser({ email, password }) {
    const { errors } = await validateLoginInput.validateAsync({
      email,
      password,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
    }

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass,
    );

    if (!match) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
    }

    const token = generateToken(user._id, user.email);

    return {
      ...user._doc,
      _id: user._id,
      token,
    };
  }

  async registerUser({
    firstName, lastName, email, password,
  }, language) {
    await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      email,
      password,
    });
    if (await User.findOne({ email })) {
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
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
    const token = await generateToken(savedUser._id, savedUser.email, {
      expiresIn: process.env.RECOVERY_EXPIRE,
      secret: process.env.CONFIRMATION_SECRET,
    });
    savedUser.confirmationToken = token;
    await savedUser.save();
    const message = {
      from: process.env.MAIL_USER,
      to: savedUser.email,
      subject: '[HORONDI] Email confirmation',
      html: confirmationMessage(firstName, token, language),
    };

    if (process.env.NODE_ENV !== 'test') {
      await sendEmail(message);
    }

    return savedUser;
  }

  async sendConfirmationLetter(email, language) {
    await validateSendConfirmation.validateAsync({ email, language });
    const user = await this.getUserByFieldOrThrow('email', email);
    if (user.confirmed) {
      throw new Error(USER_EMAIL_ALREADY_CONFIRMED);
    }
    const token = await generateToken(user._id, user.email, {
      secret: process.env.CONFIRMATION_SECRET,
      expiresIn: process.env.RECOVERY_EXPIRE,
    });
    user.confirmationToken = token;
    await user.save();
    const message = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: '[HORONDI] Email confirmation',
      html: confirmationMessage(user.firstName, token, language),
    };
    await sendEmail(message);
    return true;
  }

  async deleteUser(id) {
    const res = await User.findByIdAndDelete(id);
    return res || new Error(USER_NOT_FOUND);
  }

  async confirmUser(token) {
    const decoded = jwt.verify(token, process.env.CONFIRMATION_SECRET);
    const updates = {
      $set: {
        confirmed: true,
      },
      $unset: {
        confirmationToken: '',
      },
    };
    await User.findByIdAndUpdate(decoded.userId, updates);
    return true;
  }

  async recoverUser(email, language) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new UserInputError(USER_NOT_FOUND, { statusCode: 404 });
    }

    const token = await generateToken(user._id, user.email, {
      expiresIn: process.env.RECOVERY_EXPIRE,
      secret: process.env.SECRET,
    });
    user.recoveryToken = token;
    const message = {
      from: process.env.MAIL_USER,
      to: email,
      subject: '[HORONDI] Instructions for password recovery',
      html: recoveryMessage(user.firstName, token, language),
    };
    await sendEmail(message);
    await user.save();
    return true;
  }

  async switchUserStatus(id) {
    const user = await this.getUserByFieldOrThrow('_id', id);

    user.banned = !user.banned;

    await user.save();

    return { isSuccess: true };
  }

  async resetPassword(password, token) {
    await validateNewPassword.validateAsync({ password });
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await this.getUserByFieldOrThrow('email', decoded.email);

    if (user.recoveryToken !== token) {
      throw new UserInputError(RESET_TOKEN_NOT_VALID, { statusCode: 400 });
    }

    const dayHasPassed =      Math.floor((Date.now() - user.lastRecoveryDate) / 3600000) >= 24;
    if (dayHasPassed) {
      await User.findByIdAndUpdate(user._id, {
        recoveryAttempts: 0,
        lastRecoveryDate: Date.now(),
      });
    }
    if (user.recoveryAttempts >= 3) {
      throw new UserInputError(PASSWORD_RECOVERY_ATTEMPTS_LIMIT_EXCEEDED, {
        statusCode: 403,
      });
    }
    const updates = {
      $set: {
        lastRecoveryDate: Date.now(),
        recoveryAttempts: !user.recoveryAttempts ? 1 : ++user.recoveryAttempts,
      },
      $unset: {
        recoveryToken: '',
      },
    };
    await User.findByIdAndUpdate(user._id, updates);
    return true;
  }
}
module.exports = new UserService();
