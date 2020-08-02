const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const User = require('./user.model');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateInput
} = require('../../utils/validate-user');
const generateToken = require('../../utils/createToken');

const USER_NOT_FOUND = 'User not found' 

const USER_ALREADY_EXIST = 'User with provided email already exists'

class UserService {
  async checkUserExists(email) {
    const checkedUser = await User.findOne({
      email,
    });

    if (checkedUser) {
      throw new UserInputError(USER_ALREADY_EXIST, {
        errors: {
          email: USER_ALREADY_EXIST,
        },
      });
    }
  }

  async getUserByFieldOrThrow(key, param) {
    const checkedUser = await User.findOne({
      [key]: param,
    });

    if (!checkedUser) {
      const USER_WITH_KEY_NOT_FOUND =  `User with provided ${[key]} not found`
      throw new UserInputError(USER_WITH_KEY_NOT_FOUND, {
        errors: {
          [key]: USER_WITH_KEY_NOT_FOUND,
        },
      });
    }

    return checkedUser;
  }

  async getAllUsers() {
    return await User.find();
  }

  getUser(id) {
    return this.getUserByFieldOrThrow('_id', id);
  }
  async updateUserById(updatedUser, id) {
    const { firstName, lastName, email } = updatedUser
  
    const { errors } = await validateUpdateInput.validateAsync({ firstName, lastName, email });

    if (errors) {
      throw new UserInputError('Errors', {
        errors,
      });
    }

    const user = await this.getUserByFieldOrThrow('_id', id);

    if (user._doc.email !== updatedUser.email) {
      await this.checkUserExists(updatedUser.email);
    }

    return User.findByIdAndUpdate(user._id,{ ...user._doc, ...updatedUser }, {new: true});
  }

  async updateUserByToken(updatedUser, user) {
    const { firstName, lastName, email } = updatedUser

    const { errors } = await validateUpdateInput.validateAsync({ firstName, lastName, email });

    if (errors) {
      throw new UserInputError('Errors', {
        errors,
      });
    }

    return User.findByIdAndUpdate(user._id, {
      ...user._doc, ...updatedUser
    }, {new: true});
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
      throw new AuthenticationError( `Wrong password`);
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

  async deleteUser(id) {
    const res = await User.findByIdAndDelete(id)
    return res || new Error(USER_NOT_FOUND);
  }
}
module.exports = new UserService();
