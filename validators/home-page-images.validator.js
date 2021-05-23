const Joi = require('joi');

const homePageImagesValidator = Joi.object({
  images: Joi.object({
    large: Joi.string().trim(),
    medium: Joi.string().trim(),
    small: Joi.string().trim(),
    thumbnail: Joi.string().trim(),
  }),
});

module.exports = { homePageImagesValidator };
