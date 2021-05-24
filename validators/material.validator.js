const Joi = require('joi');

const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, CLOSURE },
} = require('../consts/material-purposes');

const { languageValidator } = require('./language.validator');

const materialInputValidator = Joi.object({
  name: Joi.array().items(languageValidator(2, 2, 6, 30)),
  description: Joi.array().items(languageValidator(2, 2, 6, 1000)),
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
