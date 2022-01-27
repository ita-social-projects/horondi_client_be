const Joi = require('joi');

const { getDaysInMilliseconds } = require('../utils/getDaysInMilliseconds');

const { certificateRegExp } = require('../consts/regexp');
const {
  CERTIFICATE_NOT_VALID,
} = require('../error-messages/certificate.messages');

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
};
