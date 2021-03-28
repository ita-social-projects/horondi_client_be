const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const { OAuth2Client } = require('google-auth-library');
const generateTokens = require('../../utils/create-tokens');
const {
  EmailActions: { CONFIRM_EMAIL, RECOVER_PASSWORD, SUCCESSFUL_CONFIRM },
} = require('../../consts/email-actions');
const emailService = require('../email/email.service');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
const {
  SECRET,
  RECOVERY_EXPIRE,
  CONFIRMATION_SECRET,
  NODE_ENV,
  REACT_APP_GOOGLE_CLIENT_ID,
  TOKEN_EXPIRES_IN,
} = require('../../dotenvValidator');
const {
  countItemsOccurency,
  changeDataFormat,
  reduceByDaysCount,
} = require('../helper-functions');
const productService = require('../product/product.service');
const verifyUser = require('../../utils/verify-user');

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
  SESSION_TIMEOUT,
} = require('../../error-messages/user.messages');
const FilterHelper = require('../../helpers/filter-helper');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST, FORBIDDEN },
} = require('../../consts/status-codes');
const {
  LOCALES: { UK },
} = require('../../consts/locations');
const {
  SOURCES: { HORONDI, GOOGLE },
  USER_FIELDS: { USER_EMAIL, USER_ID },
  userDateFormat,
  roles: { USER },
} = require('../../consts');

class UserService extends FilterHelper {
  async checkIfTokenIsValid(token) {
    const decoded = jwt.verify(token, SECRET);
    const user = await this.getUserByFieldOrThrow(USER_EMAIL, decoded.email);

    if (user.recoveryToken !== token) {
      throw new UserInputError(AUTHENTICATION_TOKEN_NOT_VALID, {
        statusCode: BAD_REQUEST,
      });
    }
    return true;
  }

  async getUserByFieldOrThrow(key, param) {
    const checkedUser = await User.findOne({
      [key]: param,
    }).exec();

    if (!checkedUser) {
      throw new UserInputError(USER_NOT_FOUND, {
        key,
        statusCode: BAD_REQUEST,
      });
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
      .collation({ locale: UK })
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
    return this.getUserByFieldOrThrow(USER_ID, id);
  }

  async updateUserById(updatedUser, user, upload) {
    if (user.email !== updatedUser.email) {
      const existingUser = await User.findOne({
        email: updatedUser.email,
      }).exec();
      if (existingUser) {
        throw new UserInputError(USER_ALREADY_EXIST, {
          statusCode: BAD_REQUEST,
        });
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
    const user = await this.getUserByFieldOrThrow(USER_EMAIL, email);
    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === HORONDI).tokenPass
    );

    if (user.role === USER) {
      throw new UserInputError(INVALID_PERMISSIONS, {
        statusCode: BAD_REQUEST,
      });
    }

    if (!match) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: BAD_REQUEST });
    }
    const { accesToken, refreshToken } = generateTokens(
      user._id,
      {
        expiresIn: TOKEN_EXPIRES_IN,
        secret: SECRET,
      },
      true
    );

    return {
      ...user._doc,
      _id: user._id,
      token: accesToken,
      refreshToken,
    };
  }

  async loginUser({ email, password, staySignedIn }) {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: BAD_REQUEST });
    }

    const match = await bcrypt.compare(
      password,
      user.credentials.find(cred => cred.source === HORONDI).tokenPass
    );

    if (!match) {
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: BAD_REQUEST });
    }
    const { accesToken, refreshToken } = generateTokens(
      user._id,
      {
        expiresIn: TOKEN_EXPIRES_IN,
        secret: SECRET,
      },
      staySignedIn
    );

    return {
      ...user._doc,
      _id: user._id,
      token: accesToken,
      refreshToken,
    };
  }

  async regenerateAccessToken(refreshTokenForVerify) {
    const { userId } = verifyUser(refreshTokenForVerify);

    if (!userId) {
      throw new UserInputError(SESSION_TIMEOUT, { statusCode: 400 });
    }
    await this.getUserByFieldOrThrow('_id', userId);
    const { accesToken, refreshToken } = generateTokens(
      userId,
      { expiresIn: TOKEN_EXPIRES_IN, secret: SECRET },
      true
    );
    return { refreshToken, token: accesToken };
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
            source: GOOGLE,
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
      throw new UserInputError(WRONG_CREDENTIALS, { statusCode: BAD_REQUEST });
    }

    const { accesToken, refreshToken } = generateTokens(
      user._id,
      {
        expiresIn: TOKEN_EXPIRES_IN,
        secret: SECRET,
      },
      staySignedIn
    );

    return {
      ...user._doc,
      _id: user._id,
      token: accesToken,
      refreshToken,
    };
  }

  async registerGoogleUser({ firstName, lastName, email, credentials }) {
    if (await User.findOne({ email }).exec()) {
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: BAD_REQUEST });
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
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: BAD_REQUEST });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      credentials: [
        {
          source: HORONDI,
          tokenPass: encryptedPassword,
        },
      ],
    });
    const savedUser = await user.save();

    const { accesToken } = generateTokens(savedUser._id, {
      expiresIn: RECOVERY_EXPIRE,
      secret: CONFIRMATION_SECRET,
    });

    savedUser.confirmationToken = accesToken;

    await emailService.sendEmail(user.email, CONFIRM_EMAIL, {
      token: accesToken,
    });
    await savedUser.save();

    return savedUser;
  }

  async sendConfirmationLetter(email, language) {
    const user = await this.getUserByFieldOrThrow(USER_EMAIL, email);
    if (user.confirmed) {
      throw new Error(USER_EMAIL_ALREADY_CONFIRMED);
    }
    const { accesToken } = generateTokens(user._id, {
      secret: CONFIRMATION_SECRET,
      expiresIn: RECOVERY_EXPIRE,
    });
    user.confirmationToken = accesToken;
    await user.save();
    await emailService.sendEmail(user.email, CONFIRM_EMAIL, { accesToken });
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
      throw new UserInputError(USER_NOT_FOUND, { statusCode: NOT_FOUND });
    }

    const { accesToken } = generateTokens(user._id, {
      expiresIn: RECOVERY_EXPIRE,
      secret: SECRET,
    });
    user.recoveryToken = accesToken;
    await emailService.sendEmail(user.email, RECOVER_PASSWORD, { accesToken });
    await user.save();
    return true;
  }

  async switchUserStatus(id) {
    const user = await this.getUserByFieldOrThrow(USER_ID, id);

    user.banned = !user.banned;

    await user.save();

    return { isSuccess: true };
  }

  async resetPassword(password, token) {
    const decoded = jwt.verify(token, SECRET);
    const user = await this.getUserByFieldOrThrow(USER_EMAIL, decoded.email);

    if (user.recoveryToken !== token) {
      throw new UserInputError(RESET_PASSWORD_TOKEN_NOT_VALID, {
        statusCode: BAD_REQUEST,
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
        statusCode: FORBIDDEN,
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

    if (await User.findOne({ email }).exec()) {
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: BAD_REQUEST });
    }

    const user = new User({
      email,
      role,
    });

    const savedUser = await user.save();
    const { accesToken } = generateTokens(savedUser._id, {
      expiresIn: TOKEN_EXPIRES_IN,
      secret: SECRET,
    });
    const invitationalToken = accesToken;

    if (NODE_ENV === 'test') {
      return { ...savedUser._doc, invitationalToken };
    }

    return savedUser;
  }

  async completeAdminRegister(updatedUser, token) {
    const { firstName, lastName, password } = updatedUser;
    let decoded;

    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, {
        statusCode: BAD_REQUEST,
      });
    }

    const user = await User.findOne({ email: decoded.email }).exec();

    if (!user) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, {
        statusCode: BAD_REQUEST,
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    user.firstName = firstName;
    user.lastName = lastName;
    user.credentials = [
      {
        source: HORONDI,
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
        statusCode: BAD_REQUEST,
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
