const Joi = require('joi');

const homepageSliderValidator = Joi.object({
  link: Joi.string()
    .min(2)
    .required()
    .trim(),
  title: Joi.array().items({
    lang: Joi.string()
      .min(2)
      .required()
      .trim(),
    value: Joi.string()
      .min(2)
      .required()
      .trim(),
  }),
  description: Joi.array().items({
    lang: Joi.string()
      .min(2)
      .required()
      .trim(),
    value: Joi.string()
      .min(2)
      .required()
      .trim(),
  }),
  images: Joi.object({
    large: Joi.string().trim(),
    medium: Joi.string().trim(),
    small: Joi.string().trim(),
    thumbnail: Joi.string().trim(),
  }),
  show: Joi.boolean(),
});

module.exports = { homepageSliderValidator };
