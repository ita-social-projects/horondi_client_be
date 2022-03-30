const Joi = require('joi');

const languageSchemaValidator = {
  lang: Joi.string().min(2).required().trim(),
  value: Joi.string().min(2).required().trim(),
};

const homepageSliderValidator = Joi.object({
  link: Joi.string().min(2).required().trim(),
  title: Joi.array().items(languageSchemaValidator),
  order: Joi.number().required(),
  description: Joi.array().items(languageSchemaValidator),
  images: Joi.object({
    large: Joi.string().trim(),
    medium: Joi.string().trim(),
    small: Joi.string().trim(),
    thumbnail: Joi.string().trim(),
  }),
  show: Joi.boolean(),
});

module.exports = { homepageSliderValidator };
