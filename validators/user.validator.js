const Joi = require('joi');

const createUserValidator = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .required(),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(20)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(50)
    .required(),
});

module.exports = {
  createUserValidator,
};
