const Joi = require('joi');

const idLength = 24;

const languageSchemaValidator = Joi.object().keys({
  lang: Joi.string()
    .max(2)
    .required(),
  value: Joi.string()
    .min(6)
    .required(),
});

const constructorMaterialsValidator = Joi.object({
  material: Joi.string().max(idLength),
  color: Joi.string().max(idLength),
});

const productInputValidator = Joi.object({
  category: Joi.string()
    .max(idLength)
    .required(), // ID!
  model: Joi.string()
    .max(idLength)
    .required(), // ID!
  name: Joi.array()
    .items(languageSchemaValidator)
    .required(), //  [LanguageInput]!
  description: Joi.array()
    .items(languageSchemaValidator)
    .required(), // [LanguageInput]!
  mainMaterial: constructorMaterialsValidator, //  { material: ID, color: ID }
  innerMaterial: constructorMaterialsValidator, //  { material: ID, color: ID }
  bottomMaterial: constructorMaterialsValidator, //  { material: ID, color: ID }
  strapLengthInCm: Joi.number()
    .integer()
    .required(), // Int!
  pattern: Joi.string()
    .max(idLength)
    .required(), // ID!
  closure: Joi.string()
    .max(idLength)
    .required(), // ID!
  sizes: Joi.array()
    .items(
      Joi.string()
        .max(idLength)
        .required()
    )
    .required(), // [ID]!
  images: Joi.array(), // [Upload],
  availableCount: Joi.number().integer(), // Int,
  basePrice: Joi.number()
    .integer()
    .required(), // Int!,
  available: Joi.bool(), // Boolean,
  isHotItem: Joi.bool(), // Boolean
});

const deleteProductValidator = Joi.object({
  id: Joi.string()
    .max(idLength)
    .required(),
});

module.exports = {
  productInputValidator,
  deleteProductValidator,
};
