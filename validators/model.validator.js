const Joi = require('joi');

const modelValidator = Joi.object({
  category: Joi.string(),
  name: Joi.array().items(
    Joi.object({
      lang: Joi.string()
        .trim()
        .required(),
      value: Joi.string().trim(),
    })
  ),
  description: Joi.array().items(
    Joi.object({
      lang: Joi.string()
        .trim()
        .required(),
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
  sizes: Joi.array().items(Joi.object()),
  availableForConstructor: Joi.boolean(),
  constructorBasic: Joi.array().items(Joi.object()),
  constructorPattern: Joi.array().items(Joi.object()),
  constructorFrontPocket: Joi.array().items(Joi.object()),
  constructorBottom: Joi.array().items(Joi.object()),
});

module.exports = {
  modelValidator,
};
