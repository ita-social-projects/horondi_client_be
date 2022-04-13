const Joi = require('joi');
const { availableForRegistrationRoles } = require('../consts');

const {
  userNameRegExp,
  passwordRegExp,
  numberRegExp,
  zipcodeRegExp,
} = require('../consts/regexp');

const createUserValidator = Joi.object({
  firstName: Joi.string().trim().regex(userNameRegExp).required(),
  lastName: Joi.string().trim().regex(userNameRegExp).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().regex(passwordRegExp).required(),
});

const loginUserValidator = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().regex(passwordRegExp).required(),
  rememberMe: Joi.bool(),
});

const emailUserValidator = Joi.string().trim().email().required();

const resetPasswordValidator = Joi.string()
  .trim()
  .regex(passwordRegExp)
  .required();

const completeAdminRegisterValidator = Joi.object({
  firstName: Joi.string().trim().regex(userNameRegExp).required(),
  lastName: Joi.string().trim().regex(userNameRegExp).required(),
  password: Joi.string().trim().regex(passwordRegExp).required(),
});

const registerAdminValidator = Joi.object({
  email: Joi.string().trim().email().required(),
  role: Joi.string()
    .required()
    .valid(...availableForRegistrationRoles),
  otp_code: Joi.string().trim().allow(''),
});

const updateUserValidator = Joi.object({
  firstName: Joi.string().trim().regex(userNameRegExp).required(),
  lastName: Joi.string().trim().regex(userNameRegExp).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().regex(passwordRegExp),
  phoneNumber: Joi.string().trim().regex(numberRegExp).allow(''),
  address: Joi.object({
    country: Joi.string().trim().min(2).max(40).allow(''),
    region: Joi.string().trim().min(2).max(40).allow(''),
    district: Joi.string().trim().min(2).max(40).allow(''),
    city: Joi.string().trim().min(2).max(40).allow(''),
    zipcode: Joi.string().trim().regex(zipcodeRegExp).allow(''),
    street: Joi.string().trim().min(2).max(40).allow(''),
    buildingNumber: Joi.string().trim().min(1).max(6).allow(''),
    appartment: Joi.string().trim().min(1).max(6).allow(''),
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
