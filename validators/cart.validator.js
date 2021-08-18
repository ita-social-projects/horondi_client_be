const Joi = require('joi');

const updateCartQuantityValidator = Joi.number()
  .min(1)
  .max(1000)
  .required();

module.exports = {
  updateCartQuantityValidator,
};
