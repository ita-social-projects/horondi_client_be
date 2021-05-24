const Joi = require('joi');

const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, CLOSURE },
} = require('../consts/material-purposes');

const schemaValidator = function(langMin, langMax, valueMin, valueMax) {
  return {
    lang: Joi.string()
      .min(langMin)
      .max(langMax)
      .required(),
    value: Joi.string()
      .min(valueMin)
      .max(valueMax)
      .required(),
  };
};

const materialInputValidator = Joi.object({
  name: Joi.array().items(schemaValidator(2, 2, 6, 30)),
  description: Joi.array().items(schemaValidator(2, 2, 6, 1000)),
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
