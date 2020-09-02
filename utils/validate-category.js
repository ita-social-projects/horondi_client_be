const Joi = require('@hapi/joi');
const { CATEGORY_DATA_NOT_VALID } = require('../error-messages/category.messages')

exports.validateCategoryInput = Joi.object({
  name: Joi.array()
    .min(2)
    .required(),
  code: Joi.string(),
  images: Joi.object(),
  subcategories: Joi.array(),
  available: Joi.boolean(),
  isMain: Joi.boolean(),
  parentId: Joi.when('isMain', { is: false, then: Joi.string().required(), otherwise: Joi.string().allow(null, '') }),
}).error(new Error(CATEGORY_DATA_NOT_VALID))
