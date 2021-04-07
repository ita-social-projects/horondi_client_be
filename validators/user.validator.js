const Joi = require('joi');
const { availableForRegistrationRoles } = require('../consts');

const {
  userNameRegExp,
  passwordRegExp,
  numberRegExp,
} = require('../consts/regexp');

const createUserValidator = Joi.object({
  firstName: Joi.string()
    .trim()
    .regex(userNameRegExp)
    .required(),
  lastName: Joi.string()
    .trim()
    .regex(userNameRegExp)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .trim()
    .regex(passwordRegExp)
    .required(),
});

const loginUserValidator = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .trim()
    .regex(passwordRegExp)
    .required(),
  staySignedIn: Joi.bool(),
});

const emailUserValidator = Joi.string()
  .trim()
  .email()
  .required();

const resetPasswordValidator = Joi.string()
  .trim()
  .regex(passwordRegExp)
  .required();

const completeAdminRegisterValidator = Joi.object({
  firstName: Joi.string()
    .trim()
    .regex(userNameRegExp)
    .required(),
  lastName: Joi.string()
    .trim()
    .regex(userNameRegExp)
    .required(),
  password: Joi.string()
    .trim()
    .regex(passwordRegExp)
    .required(),
});

const registerAdminValidator = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required(),
  role: Joi.string()
    .required()
    .valid(...availableForRegistrationRoles),
  code: Joi.string()
    .trim()
    .allow(''),
});

const updateUserValidator = Joi.object({
  firstName: Joi.string()
    .trim()
    .regex(userNameRegExp),
  lastName: Joi.string()
    .trim()
    .regex(userNameRegExp),
  email: Joi.string()
    .trim()
    .email(),
  password: Joi.string()
    .trim()
    .regex(passwordRegExp),
  phoneNumber: Joi.string()
    .trim()
    .regex(numberRegExp),
  address: Joi.object({
    country: Joi.string()
      .trim()
      .alphanum(),
    region: Joi.string()
      .trim()
      .alphanum(),
    city: Joi.string()
      .trim()
      .alphanum(),
    zipcode: Joi.string()
      .trim()
      .alphanum(),
    street: Joi.string()
      .trim()
      .alphanum(),
    buildingNumber: Joi.string()
      .trim()
      .alphanum(),
    appartment: Joi.string()
      .trim()
      .alphanum(),
  }),
}).unknown();

module.exports = {
  createUserValidator,
  loginUserValidator,
  emailUserValidator,
  resetPasswordValidator,
  completeAdminRegisterValidator,
  registerAdminValidator,
  updateUserValidator,
};
