const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput,
  validateNewPassword,
  validateAdminRegisterInput
} = require('../../utils/validate-user');
const generateToken = require('../../utils/create-token');
const { sendEmail } = require('../../utils/sendGrid-email')
const {
  confirmationMessage,
  recoveryMessage,
  adminConfirmationMessage
} = require('../../utils/localization');

const {
  USER_ALREADY_EXIST,
  USER_NOT_FOUND,
  INPUT_NOT_VALID,
  WRONG_CREDENTIALS,
  INVALID_PERMISSIONS,
  INVALID_ADMIN_INVITATIONAL_TOKEN
} = require('../../error-messages/user.messages');

const ROLES = {
  admin: 'admin',
  user: 'user'
};

const SOURCES = {
  horondi: 'horondi',
};

class UserService {
  async checkIfTokenIsValid(token) {
    const decoded = jwt.verify(token, process.env.SECRET);
    await this.getUserByFieldOrThrow('email', decoded.email);
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

  async updateUserById(updatedUser, id) {
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

    return User.findByIdAndUpdate(
      user._id,
      { ...user._doc, ...updatedUser },
      { new: true },
    );
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
      ...user._doc,
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
    const { errors } = await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      email,
      password,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

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
      EXPIRES_IN: undefined,
    });
    const message = {
      from: process.env.MAIL_USER,
      to: savedUser.email,
      subject: 'Confirm Email',
      html: confirmationMessage(firstName, token, language),
    };

    if (process.env.NODE_ENV !== 'test') {
      await sendEmail(message);
    }

    return savedUser;
  }

  async deleteUser(id) {
    const res = await User.findByIdAndDelete(id);
    return res || new Error(USER_NOT_FOUND);
  }

  async confirmUser(token) {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await this.getUserByFieldOrThrow('email', decoded.email);
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

  async switchUserStatus(id) {
    const user = await this.getUserByFieldOrThrow('_id', id);

    user.banned = !user.banned;

    await user.save();

    return { isSuccess: true };
  }

  async resetPassword(password, token) {
    const { errors } = await validateNewPassword.validateAsync({
      password,
    });

    if (errors) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new UserInputError(USER_NOT_FOUND, { statusCode: 400 });
    }

    user.credentials[0].tokenPass = await bcrypt.hash(password, 12);
    await user.save();
    return true;
  }

  async registerAdmin(userInput) {
      const {email,role} = userInput;

      try {
        await validateAdminRegisterInput.validateAsync({ email,role })
      } 
      catch(err) {
        throw new UserInputError(INPUT_NOT_VALID,{statusCode: 400})
      }
    
      if (await User.findOne({ email })) {
        throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
      }

      const user = new User({
        email,
        role
      });

      const savedUser = await user.save();
      const token = await generateToken(savedUser._id, savedUser.email);

      const message = {
        from: process.env.MAIL_USER,
        to: savedUser.email,
        subject: '[Horondi] Invitation to become an admin',
        html: adminConfirmationMessage(token),
      };
  
      if (process.env.NODE_ENV === 'test') {
        console.log(token);
        return {...savedUser._doc,token}
      }

      await sendEmail(message);

      return savedUser;
  }

  async completeAdminRegister(updatedUser,token){
    const {firstName,lastName,password} = updatedUser;
    let decoded;

    try {
    await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      password
    });
    } catch (err) {
      throw new UserInputError(INPUT_NOT_VALID, { statusCode: 400 });
    }

    try {
      decoded = jwt.verify(token,process.env.SECRET);
    } 
    catch(err) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, { statusCode: 400 });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, { statusCode: 400 });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    user.firstName = firstName;
    user.lastName = lastName;
    user.credentials = [
      {
        source: 'horondi',
        tokenPass: encryptedPassword,
      }
    ];
    user.confirmed = true;
    
    await user.save();
    
    return { isSuccess: true };
  }

  validateConfirmationToken(token){
    try {
      jwt.verify(token,process.env.SECRET);
      return {isSuccess: true};
    }
    catch(err) {
      throw new UserInputError(INVALID_ADMIN_INVITATIONAL_TOKEN, { statusCode: 400 });
    }
  }
}
module.exports = new UserService();
