const Joi = require('@hapi/joi');

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

exports.validateUpdateInput = Joi.object({
  firstName: Joi.string()
    .alphanum()
    .min(3)
    .max(30),

  lastName: Joi.string()
    .alphanum()
    .min(3)
    .max(30),

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
  }),
});