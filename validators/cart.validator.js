const Joi = require('joi');

const updateCartQuantityValidator = Joi.number()
  .min(1)
  .required();

module.exports = {
  updateCartQuantityValidator,
};
