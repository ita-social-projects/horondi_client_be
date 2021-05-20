const Joi = require('joi');
const businessTextValidator = Joi.object({
  code: Joi.string()
    .trim()
    .required()
    .min(2)
    .max(20),
  title: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string().trim(),
  }),
  text: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string().trim(),
  }),
  languages: Joi.array().items(Joi.string().trim()),
});

module.exports = {
  businessTextValidator,
};
