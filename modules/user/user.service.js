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

  async getUserByFieldOrThrow(key, param) {
    const checkedUser = await User.findOne({ [key]: param });

    if (!checkedUser) {
      const message = `User with provided ${[key]} not found`;
      throw new UserInputError(message, {
        errors: {
          [key]: message,
        },
      });
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

  async loginUser({ email, password }) {
    const { errors } = await validateLoginInput.validateAsync({
      email,
      password,
    });

    if (errors) {
      throw new UserInputError('Errors', { errors });
    }

    const user = await this.getUserByFieldOrThrow('email', email);

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
      to: 'bobbyf4de@gmail.com',
      subject: 'Confirm Email',
      html: confirmationMessage(firstName, token),
    };
    await sendEmail(message, () => {
      console.log('Successful registration!');
    });
    return savedUser;
  }

  deleteUser(id) {
    return User.findByIdAndDelete(id);
  }

  async confirmUser(token) {
    const decoded = jwt.verify(token, process.env.SECRET);
    // console.log(decoded);
    const user = await User.findOne({ email: decoded.email });
    console.log(user);
    if (!user) {
      return new Error('Token is not valid');
    }
    console.log('USER CONFIRMED', user.confirmed);
    if (user.confirmed) {
      return new Error('The user is already confirmed!');
    }
    user.confirmed = true;
    await User.findByIdAndUpdate(user._id, user);
    return true;
  }
}
module.exports = new UserService();
