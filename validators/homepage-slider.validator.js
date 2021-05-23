const Joi = require('joi');

const homepageSliderValidator = Joi.object({
  title: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string().trim(),
  }),
  description: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string().trim(),
  }),
  link: Joi.string()
    .min(1)
    .max(30)
    .trim(),
  images: Joi.object({
    large: Joi.string().trim(),
    medium: Joi.string().trim(),
    small: Joi.string().trim(),
    thumbnail: Joi.string().trim(),
  }),
  order: Joi.number().integer(),
  show: Joi.boolean(),
});

module.exports = { homepageSliderValidator };
