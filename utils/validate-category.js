const Joi = require('@hapi/joi');
const {
  CATEGORY_DATA_NOT_VALID,
} = require('../error-messages/category.messages');

exports.validateCategoryInput = Joi.object({
  name: Joi.array().min(2).required(),
  code: Joi.string(),
  images: Joi.object(),
  available: Joi.boolean(),
}).error(new Error(CATEGORY_DATA_NOT_VALID));
