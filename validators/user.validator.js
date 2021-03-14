const Joi = require('joi');

const { userNameRegExp, passwordRegExp } = require('../consts/regexp');

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

const recoverUserValidator = Joi.string()
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

module.exports = {
  createUserValidator,
  loginUserValidator,
  recoverUserValidator,
  resetPasswordValidator,
  completeAdminRegisterValidator,
};
