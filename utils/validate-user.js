const Joi = require('@hapi/joi');
const { UserInputError } = require('apollo-server');
const { INPUT_NOT_VALID } = require('../error-messages/user.messages');

exports.validateRegisterInput = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(30)
    .required(),

  lastName: Joi.string()
    .min(2)
    .max(30)
    .required(),

  password: Joi.string()
    .min(8)
    .max(20)
    .required(),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),
}).error(new UserInputError(INPUT_NOT_VALID, { statusCode: 400 }));

exports.validateUpdateInput = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(30),

  lastName: Joi.string()
    .min(2)
    .max(30),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),
});

exports.validateLoginInput = Joi.object({
  password: Joi.string()
    .min(8)
    .max(20)
    .required(),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),
});

exports.validateNewPassword = Joi.object({
  password: Joi.string()
    .min(8)
    .max(20)
    .required()
    .error(new UserInputError(INPUT_NOT_VALID, { statusCode: 400 })),
});

exports.validateSendConfirmation = Joi.object({
  email: Joi.string()
    .pattern(
      new RegExp(
        '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$',
      ),
    )
    .required(),
  language: Joi.number()
    .integer()
    .min(0),
}).error(new UserInputError(INPUT_NOT_VALID, { statusCode: 400 }));
