const Joi = require('joi');

const languageSchemaValidator = {
  lang: Joi.string().max(2).required(),
  value: Joi.string().min(3).max(1000).required(),
};

const constructorMaterialsValidator = Joi.object({
  material: Joi.string().required(),
  color: Joi.string().required(),
});

const productInputValidator = Joi.object({
  category: Joi.string().required(),
  model: Joi.string().required(),
  name: Joi.array().items(languageSchemaValidator).required(),
  description: Joi.array().items(languageSchemaValidator).required(),
  mainMaterial: constructorMaterialsValidator,
  innerMaterial: constructorMaterialsValidator,
  bottomMaterial: constructorMaterialsValidator,
  backMaterial: constructorMaterialsValidator,
  strapLengthInCm: Joi.number().integer().min(0).required(),
  pattern: Joi.string().required(),
  closure: Joi.string().required(),
  sizes: Joi.array().items(Joi.string().required()).required(),
  images: Joi.array(),
  availableCount: Joi.number().integer(),
  basePrice: Joi.number().min(0).required(),
  available: Joi.bool(),
  isHotItem: Joi.bool(),
});

const productFromConstructorInputValidator = Joi.object({
  model: Joi.string().required(),
  name: Joi.array().items(languageSchemaValidator).required(),
  mainMaterial: constructorMaterialsValidator,
  bottomMaterial: constructorMaterialsValidator,
  pattern: Joi.string(),
  sizes: Joi.array().items(Joi.string().required()).required(),
  images: Joi.array(),
  basePrice: Joi.number().min(0).required(),
});

const deleteProductValidator = Joi.string().required();

module.exports = {
  productInputValidator,
  productFromConstructorInputValidator,
  deleteProductValidator,
};
