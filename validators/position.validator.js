const Joi = require('joi');

const languageSchemaValidator = {
  lang: Joi.string().trim().max(2).required(),
  value: Joi.string().trim().min(2).max(1000).required(),
};

const positionInputValidator = Joi.object({
  name: Joi.array().items(languageSchemaValidator).required(),
  available: Joi.bool().required(),
  optionType: Joi.string().required(),
});

module.exports = {
  positionInputValidator,
};
