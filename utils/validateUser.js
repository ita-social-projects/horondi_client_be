const Joi = require('@hapi/joi');
const { UserInputError } = require('apollo-server');
const User = require('../modules/user/user.model');

exports.checkUserExist = async email => {
  const checkedUser = await User.findOne({ email });

  if (!checkedUser) {
    const massage = 'User with provided email not found';
    throw new UserInputError(massage, {
      errors: {
        email: massage,
      },
    });
  }

  return checkedUser;
};

exports.validateRegisterInput = Joi.object({
  firstName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  lastName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .min(8)
    .max(20)
    .required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
});

exports.validateLoginInput = Joi.object({
  password: Joi.string()
    .min(8)
    .max(20)
    .required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
});
