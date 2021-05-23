const Joi = require('joi');

const homePageImagesValidator = Joi.object({
  id: string()
    .trim()
    .required(),
  images: Joi.object({
    large: Joi.string().trim(),
    medium: Joi.string().trim(),
    small: Joi.string().trim(),
    thumbnail: Joi.string().trim(),
  }),
});

module.exports = { homePageImagesValidator };
