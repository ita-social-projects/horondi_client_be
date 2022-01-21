const Joi = require('joi');
const { certificateRegExp } = require('../consts/regexp');
const { getDaysInMilliseconds } = require('../utils/getDaysInMilliseconds');

const certificateNameValidator = Joi.object({
  name: Joi.string()
    .trim()
    .regex(certificateRegExp)
    .required(),
});

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
