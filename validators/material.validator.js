const Joi = require('joi');

const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, CLOSURE },
} = require('../consts/material-purposes');

const languageSchemaValidator = {
  lang: Joi.string()
    .trim()
    .required(),
  value: Joi.string().trim(),
};

const materialInputValidator = Joi.object({
  name: Joi.array().items(languageSchemaValidator),
  description: Joi.array().items(languageSchemaValidator),
  purpose: Joi.string()
    .trim()
    .valid(MAIN, INNER, BOTTOM, PATTERN, CLOSURE)
    .required(),
  colors: Joi.array().items(Joi.string().required()),
  available: Joi.boolean(),
  additionalPrice: Joi.number().integer(),
});

module.exports = {
  materialInputValidator,
};
