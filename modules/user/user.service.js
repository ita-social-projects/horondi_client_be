const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const { OAuth2Client } = require('google-auth-library');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
  validateNewPassword,
  validateSendConfirmation,
  validateAdminRegisterInput,
} = require('../../utils/validate-user');
const generateToken = require('../../utils/create-token');
const generateTokens = require('../../utils/create-tokens');
const { sendEmail } = require('../../utils/sendGrid-email');
const {
  confirmationMessage,
  recoveryMessage,
  adminConfirmationMessage,
} = require('../../utils/localization');
const emailService = require('../confirm-email/confirmation-email.service');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
const {
  SECRET,
  RECOVERY_EXPIRE,
  CONFIRMATION_SECRET,
  MAIL_USER,
  NODE_ENV,
  REACT_APP_GOOGLE_CLIENT_ID,
} = require('../../dotenvValidator');
const {
  removeDaysFromData,
  countItemsOccurency,
  changeDataFormat,
  reduceByDaysCount,
} = require('../helper-functions');
const productService = require('../product/product.service');
const { generateRefreshToken } = require('../../utils/token');

const {
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  INPUT_NOT_VALID,
  WRONG_CREDENTIALS,
  INVALID_PERMISSIONS,
  PASSWORD_RECOVERY_ATTEMPTS_LIMIT_EXCEEDED,
  RESET_PASSWORD_TOKEN_NOT_VALID,
  AUTHENTICATION_TOKEN_NOT_VALID,
  USER_EMAIL_ALREADY_CONFIRMED,
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  ID_NOT_PROVIDED,
  SESSION_TIMEOUT,
  INVALID_TOKEN_TYPE,
} = require('../../error-messages/user.messages');
const { userDateFormat } = require('../../consts');
const FilterHelper = require('../../helpers/filter-helper');

const ROLES = {
  admin: 'admin',
  user: 'user',
};

const SOURCES = {
  horondi: 'horondi',
};

class UserService extends FilterHelper {
  async checkIfTokenIsValid(token) {
    const decoded = jwt.verify(token, SECRET);
    const user = await this.getUserByFieldOrThrow('email', decoded.email);

    if (user.recoveryToken !== token) {
      throw new UserInputError(AUTHENTICATION_TOKEN_NOT_VALID, {
        statusCode: 400,
      });
    }
    return true;
  }

  async getUserByFieldOrThrow(key, param) {
    const checkedUser = await User.findOne({
      [key]: param,
    }).exec();

    if (!checkedUser) {
      throw new UserInputError(USER_NOT_FOUND, { key, statusCode: 400 });
    }

    return checkedUser;
  }

  async getPurchasedProducts(id) {
    const user = await User.findOne({
      _id: id,
    })
      .populate('orders')
      .exec();
    const paidOrders = user.orders.filter(order => order.isPaid);
    const purchasedProducts = paidOrders.reduce((acc, order) => {
      acc = [...acc, ...order.items.map(item => ({ _id: item.productId }))];
      return acc;
    }, []);
    return purchasedProducts;
  }

  async getAllUsers({ filter, pagination, sort }) {
    let filteredItems = this.filterItems(filter);
    let aggregatedItems = this.aggregateItems(filteredItems, pagination, sort);

    const [users] = await User.aggregate([
      {
        $addFields: {
          name: { $concat: ['$firstName', ' ', '$lastName'] },
        },
      },
    ])
      .collation({ locale: 'uk' })
      .facet({
        items: aggregatedItems,
        calculations: [{ $match: filteredItems }, { $count: 'count' }],
      })
      .exec();
    let userCount;

    const {
      items,
      calculations: [calculations],
    } = users;

    if (calculations) {
      userCount = calculations.count;
    }

    return {
      items,
      count: userCount || 0,
    };
  }

  async getUsersForStatistic({ filter }) {
    const filters = this.filterItems(filter);
    const users = await User.find(filters)
      .sort({ registrationDate: 1 })
      .lean()
      .exec();
    const formatedData = users.map(el =>
      changeDataFormat(el.registrationDate, userDateFormat)
    );
    const userOccurency = countItemsOccurency(formatedData);
    const counts = Object.values(userOccurency);
    const names = Object.keys(userOccurency);
    const total = counts.reduce(
      (userTotal, userCount) => userTotal + userCount,
      0
    );

    const { labels, count } = reduceByDaysCount(names, counts, filter.days);

    return { labels, counts: count, total };
  }

  async getUser(id) {
    return this.getUserByFieldOrThrow('_id', id);
  }

  async updateUserById(updatedUser, user, upload) {
    const { firstName, lastName, email } = updatedUser;

    const { errors } = await validateUpdateInput.validateAsync({
      firstName,
      lastName,
      email,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    if (user.email !== updatedUser.email) {
      const existingUser = await User.findOne({
        email: updatedUser.email,
      }).exec();
      if (existingUser) {
        throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
      }
    }
    if (!user.images) user.images = [];
    if (upload) {
      if (user.images.length) {
        await deleteFiles(
          Object.values(user.images).filter(
            item => typeof item === 'string' && item
          )
        );
      }
      const uploadResult = await uploadFiles([upload]);
      const imageResults = await uploadResult[0];
      updatedUser.images = imageResults.fileNames;
    }
    return User.findByIdAndUpdate(user._id, updatedUser, { new: true });
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
      { new: true }
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
      user.credentials.find(cred => cred.source === SOURCES.horondi).tokenPass
    );

    if (user.role === ROLES.user) {
      throw new UserInputError(INVALID_PERMISSIONS, { statusCode: 400 });
    }

    if (!match) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
    }
    const { accesToken } = generateTokens(user._id);

    return {
      ...user._doc,
      _id: user._id,
      token: accesToken,
    };
  }

  async loginUser({ email, password, staySignedIn }) {
    const { errors } = await validateLoginInput.validateAsync({
      email,
      password,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
    }

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === 'horondi').tokenPass
    );

    if (!match) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
    }
    const { accesToken, refreshToken } = generateTokens(user._id, staySignedIn);

    return {
      ...user._doc,
      _id: user._id,
      token: accesToken,
      refreshToken,
    };
  }

  async regenerateAccessToken(refreshTokenForVerify) {
    const decoded = jwt.verify(refreshTokenForVerify, SECRET);
    console.log(decoded);

    if (!decoded) {
      throw new UserInputError(SESSION_TIMEOUT, { statusCode: 400 });
    }
    await this.getUserByFieldOrThrow('_id', decoded.userId);

    const { accesToken, refreshToken } = generateTokens(decoded.userId, true);

    return {
      refreshToken,
      token: accesToken,
    };
  }

  async googleUser(idToken, staySignedIn) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: REACT_APP_GOOGLE_CLIENT_ID,
    });
    const dataUser = ticket.getPayload();
    const userid = dataUser.sub;
    if (!(await User.findOne({ email: dataUser.email }).exec())) {
      await this.registerGoogleUser({
        firstName: dataUser.given_name,
        lastName: dataUser.family_name,
        email: dataUser.email,
        credentials: [
          {
            source: 'google',
            tokenPass: userid,
          },
        ],
      });
    }
    return this.loginGoogleUser({
      email: dataUser.email,
      staySignedIn,
    });
  }

  async loginGoogleUser({ email, staySignedIn }) {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: 400 });
    }

    const { accesToken, refreshToken } = generateTokens(user._id, staySignedIn);

    return {
      ...user._doc,
      _id: user._id,
      token: accesToken,
      refreshToken,
    };
  }

  async registerGoogleUser({ firstName, lastName, email, credentials }) {
    if (await User.findOne({ email }).exec()) {
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      credentials,
    });
    const savedUser = await user.save();

    return savedUser;
  }

  async registerUser({ firstName, lastName, email, password }, language) {
    if (await User.findOne({ email }).exec()) {
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

    const token = generateTokens(savedUser._id, false, {
      expiresIn: RECOVERY_EXPIRE,
      secret: CONFIRMATION_SECRET,
    });

    savedUser.confirmationToken = token;

    await savedUser.save();

    const subject = '[HORONDI] Email confirmation';
    const html = confirmationMessage(firstName, token, language);

    await emailService.sendEmail({
      user,
      sendEmail,
      subject,
      html,
    });

    await savedUser.save();

    return savedUser;
  }

  async sendConfirmationLetter(email, language) {
    await validateSendConfirmation.validateAsync({ email, language });
    const user = await this.getUserByFieldOrThrow('email', email);
    if (user.confirmed) {
      throw new Error(USER_EMAIL_ALREADY_CONFIRMED);
    }
    const token = generateTokens(user._id, false, {
      secret: CONFIRMATION_SECRET,
      expiresIn: RECOVERY_EXPIRE,
    });
    user.confirmationToken = token;
    await user.save();
    const message = {
      from: MAIL_USER,
      to: user.email,
      subject: '[HORONDI] Email confirmation',
      html: confirmationMessage(user.firstName, token, language),
    };
    await sendEmail(message);
    return true;
  }

  async deleteUser(id) {
    const res = await User.findByIdAndDelete(id).exec();
    return res || new Error(USER_NOT_FOUND);
  }

  async confirmUser(token) {
    const decoded = jwt.verify(token, CONFIRMATION_SECRET);
    const updates = {
      $set: {
        confirmed: true,
      },
      $unset: {
        confirmationToken: '',
      },
    };
    await User.findByIdAndUpdate(decoded.userId, updates).exec();
    return true;
  }

  async recoverUser(email, language) {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new UserInputError(USER_NOT_FOUND, { statusCode: 404 });
    }

    const token = generateTokens(user._id, false, {
      expiresIn: RECOVERY_EXPIRE,
      secret: SECRET,
    });
    user.recoveryToken = token;
    const message = {
      from: MAIL_USER,
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
    const decoded = jwt.verify(token, SECRET);
    const user = await this.getUserByFieldOrThrow('email', decoded.email);

    if (user.recoveryToken !== token) {
      throw new UserInputError(RESET_PASSWORD_TOKEN_NOT_VALID, {
        statusCode: 400,
      });
    }

    const dayHasPassed =
      Math.floor((Date.now() - user.lastRecoveryDate) / 3600000) >= 24;
    if (dayHasPassed) {
      await User.findByIdAndUpdate(user._id, {
        recoveryAttempts: 0,
        lastRecoveryDate: Date.now(),
      }).exec();
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
    await User.findByIdAndUpdate(user._id, updates).exec();
    return true;
  }

  async registerAdmin(userInput) {
    const { email, role } = userInput;

    try {
      await validateAdminRegisterInput.validateAsync({ email, role });
    } catch (err) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    if (await User.findOne({ email }).exec()) {
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
    }

    const user = new User({
      email,
      role,
    });

    const savedUser = await user.save();
    const invitationalToken = generateTokens(savedUser._id);

    if (NODE_ENV === 'test') {
      return { ...savedUser._doc, invitationalToken };
    }

    const message = {
      from: MAIL_USER,
      to: savedUser.email,
      subject: '[Horondi] Invitation to become an admin',
      html: adminConfirmationMessage(invitationalToken),
    };

    await sendEmail(message);

    return savedUser;
  }

  async completeAdminRegister(updatedUser, token) {
    const { firstName, lastName, password } = updatedUser;
    let decoded;

    try {
      await validateRegisterInput.validateAsync({
        firstName,
        lastName,
        password,
      });
    } catch (err) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, {
        statusCode: 400,
      });
    }

    const user = await User.findOne({ email: decoded.email }).exec();

    if (!user) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, {
        statusCode: 400,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    user.firstName = firstName;
    user.lastName = lastName;
    user.credentials = [
      {
        source: 'horondi',
        tokenPass: encryptedPassword,
      },
    ];
    user.confirmed = true;

    await user.save();

    return { isSuccess: true };
  }

  validateConfirmationToken(token) {
    try {
      jwt.verify(token, SECRET);
      return { isSuccess: true };
    } catch (err) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, {
        statusCode: 400,
      });
    }
  }

  async updateCartOrWishlist(userId, key, list, productId) {
    await User.findByIdAndUpdate(userId, { [key]: list }).exec();
    return productService.getProductById(productId);
  }

  addProductToWishlist(productId, key, user) {
    const newList = [...user.wishlist, productId];
    return this.updateCartOrWishlist(user._id, key, newList, productId);
  }

  removeProductFromWishlist(productId, key, user) {
    const newList = user.wishlist.filter(id => String(id) !== productId);
    return this.updateCartOrWishlist(user._id, key, newList, productId);
  }
}

module.exports = new UserService();
