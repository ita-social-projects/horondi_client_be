const Joi = require('joi');
const colorValidator = Joi.object({
  name: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .required(),
  }),
  colorHex: Joi.string()
    .trim()
    .required()
    .min(2)
    .max(10),
  simpleName: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .required(),
  }),
});

module.exports = {
  colorValidator,
};
