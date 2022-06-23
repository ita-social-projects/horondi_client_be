const Joi = require('joi');

const { numberContactsRegExp } = require('../consts/regexp');

const languageSchemaValidator = {
  lang: Joi.string().trim().max(2).required(),
  value: Joi.string().trim().min(10).max(1000).required(),
};

const contactInputValidator = Joi.object({
  phoneNumber: Joi.string().trim().regex(numberContactsRegExp).required(),
  openHours: Joi.array().items(languageSchemaValidator).required(),
  address: Joi.array().items(languageSchemaValidator).required(),
  email: Joi.string().trim().email().required(),
  link: Joi.object({
    lat: Joi.string().trim().required(),
    lon: Joi.string().trim().required(),
  }),
});

module.exports = {
  contactInputValidator,
};
