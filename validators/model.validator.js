const Joi = require('joi');

const modelValidator = Joi.object({
  category: Joi.string().required(),
  name: Joi.array().items(
    Joi.object({
      lang: Joi.string().trim().required(),
      value: Joi.string().trim(),
    })
  ),
  description: Joi.array().items(
    Joi.object({
      lang: Joi.string().trim().required(),
      value: Joi.string().trim(),
    })
  ),
  images: Joi.object({
    large: Joi.string().trim(),
    medium: Joi.string().trim(),
    small: Joi.string().trim(),
    thumbnail: Joi.string().trim(),
  }),
  priority: Joi.number().integer(),
  show: Joi.boolean(),
  sizes: Joi.array().items(Joi.string()),
  availableForConstructor: Joi.boolean(),
  eligibleOptions: Joi.object({
    constructorBasic: Joi.array().items(Joi.string()),
    constructorPattern: Joi.array().items(Joi.string()),
    constructorFrontPocket: Joi.array().items(Joi.string()),
    constructorBottom: Joi.array().items(Joi.string()),
    constructorPocket: Joi.array().items(Joi.string()),
    constructorBack: Joi.array().items(Joi.string()),
    constrBottom: Joi.array().items(Joi.string()),
    constructorClosure: Joi.array().items(Joi.string()),
    constructorStrap: Joi.array().items(Joi.string()),
  }),
  appliedOptions: Joi.object({
    constructorBasic: Joi.string(),
    constructorPattern: Joi.string(),
    constructorFrontPocket: Joi.string(),
    constructorBottom: Joi.string(),
    constructorPocket: Joi.string(),
    constructorBack: Joi.string(),
    constrBottom: Joi.string(),
    constructorClosure: Joi.string(),
    constructorStrap: Joi.string(),
  }),
  restrictions: Joi.array().items(Joi.string()),
});

module.exports = {
  modelValidator,
};
