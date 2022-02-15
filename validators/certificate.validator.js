const Joi = require('joi');

const { getDaysInMilliseconds } = require('../utils/getDaysInMilliseconds');

const { certificateRegExp } = require('../consts/regexp');
const {
  CERTIFICATE_NOT_VALID,
} = require('../error-messages/certificate.messages');

const certificateData = Joi.object().keys({
  count: Joi.number()
    .error(() => ({
      message: 'Count must be a number',
    }))
    .min(1)
    .error(() => ({
      message: 'Count should be greater than 0',
    }))
    .required(),
  value: Joi.number()
    .integer()
    .min(500)
    .valid(500, 1000, 1500)
    .error(() => ({
      message: 'Certificate value should be 500, 1000 or 1500',
    }))
    .required(),
});

const certificateInputValidator = Joi.array().items(certificateData);

const certificateNameValidator = Joi.string()
  .trim()
  .regex(certificateRegExp)
  .error(() => ({
    message: CERTIFICATE_NOT_VALID,
  }))
  .required();

const certificateDateValidator = Joi.object({
  startDate: Joi.date()
    .greater('now')
    .error(() => ({
      message: "Date can't be less then now.",
    }))
    .less(new Date() + getDaysInMilliseconds(30))
    .error(() => ({
      message: "Date can't be greater then 30 days.",
    })),
});

module.exports = {
  certificateNameValidator,
  certificateDateValidator,
  certificateInputValidator,
};
