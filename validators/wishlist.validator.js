const Joi = require('joi');

const wishlistInputValidator = Joi.object({
  product: Joi.string().trim().required(),
});

module.exports = wishlistInputValidator;
