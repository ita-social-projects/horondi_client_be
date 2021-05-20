const Joi = require('joi');

const { numberRegExp } = require('../consts/regexp');

const languageSchemaValidator = {
  lang: Joi.string()
    .trim()
    .max(2)
    .required(),
  value: Joi.string()
    .trim()
    .min(6)
    .max(1000)
    .required(),
};

const contactInputValidator = Joi.object({
  phoneNumber: Joi.string()
    .trim()
    .regex(numberRegExp)
    .required(),
  openHours: Joi.array()
    .items(languageSchemaValidator)
    .required(),
  address: Joi.array()
    .items(languageSchemaValidator)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .required(),
  images: Joi.array(),
  link: Joi.string()
    .trim()
    .min(2)
    .max(1000)
    .required(),
});

module.exports = {
  contactInputValidator,
};
