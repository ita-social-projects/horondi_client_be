const Joi = require('joi');

const homepageSliderValidator = Joi.object({
  title: Joi.array().items({
    link: Joi.string()
      .min(2)
      .required()
      .trim(),
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
