// const userService = require("../user.service");
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput } = require('../../../utils/validate-user');
const User = require('../user.model');

class NewUserService {
  async registerUser({ firstName, lastName, email, password }, language) {
    await validateRegisterInput.validateAsync({
      firstName,
      lastName,
      email,
      password,
    });
    if (await User.findOne({ email })) {
      throw new UserInputError(USER_ALREADY_EXIST, { statusCode: 400 });
    }

    console.log(
      'fjkhksdjkfjdskfnlksdnjfsjklfjsdb2[o21u3092y n3el;wopjdomw;ndopjslmkcljs[ifdspkfposd'
    );
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
}

module.exports = new NewUserService();
