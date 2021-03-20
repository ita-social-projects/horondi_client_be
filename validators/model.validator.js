const Joi = require('joi');

const modelValidator = Joi.object({
  category: Joi.string(),
  name: Joi.object({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string().trim(),
  }),
  description: Joi.object({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string().trim(),
  }),
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
  constructorBasic: Joi.array().items(Joi.string()),
  constructorPattern: Joi.array().items(Joi.string()),
  constructorFrontPocket: Joi.array().items(Joi.string()),
  constructorBottom: Joi.array().items(Joi.string()),
});

module.exports = {
  modelValidator,
};
