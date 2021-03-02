const Joi = require('joi');
const { rule } = require('graphql-shield');

const RuleError = require('../errors/rule.error');
const {
  STATUS_CODES: { FORBIDDEN },
} = require('../consts/status-codes');
const { createUserValidator } = require('../validators/user.validator');

const registerUserValidation = rule()((_, { user }) => {
  const { error } = Joi.validate(user, createUserValidator);

  if (!error) {
    return true;
  } else {
    return new RuleError(error.details[0].message, FORBIDDEN);
  }
});

module.exports = {
  registerUserValidation,
};
