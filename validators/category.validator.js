const Joi = require('joi');

const categoryValidator = Joi.object({
  code: Joi.string()
    .trim()
    .required(),
  name: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string().trim(),
  }),
  images: Joi.object({
    large: Joi.string().trim(),
    medium: Joi.string().trim(),
    small: Joi.string().trim(),
    thumbnail: Joi.string().trim(),
  }),
  available: Joi.boolean(),
});

module.exports = {
  categoryValidator,
};
