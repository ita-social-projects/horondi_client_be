const Joi = require('joi');
const {
  SIDES: { LEFT, RIGHT, BACK, FRONT },
} = require('../consts/side-names');

const nestedSideValidator = Joi.object({
  side: Joi.array().has(
    Joi.string()
      .trim()
      .valid(RIGHT, LEFT, FRONT, BACK)
      .required()
  ),
});

const nestedNameValidator = Joi.object({
  lang: Joi.string()
    .trim()
    .required(),
  value: Joi.string()
    .trim()
    .required(),
});

const inputPocketValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .uppercase(),
  model: Joi.string(),
  features: nestedSideValidator,
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.number()
    .optional()
    .default(0),
  available: Joi.boolean().required(),
  customizable: Joi.boolean(),
});

const inputOptionValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .uppercase(),
  model: Joi.string(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string(),
  additionalPrice: Joi.number()
    .optional()
    .default(0),
  available: Joi.boolean().required(),
  customizable: Joi.boolean(),
});

const inputStrapValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .uppercase(),
  model: Joi.string(),
  features: Joi.object({
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.number()
    .optional()
    .default(0),
  available: Joi.boolean().required(),
  customizable: Joi.boolean(),
});

const inputPatternValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .uppercase(),
  model: Joi.string(),
  features: Joi.object({
    material: Joi.string(),
    handmade: Joi.boolean().required(),
  }),
  description: Joi.array().has(nestedNameValidator),
  images: Joi.object({
    large: Joi.string(),
    medium: Joi.string(),
    small: Joi.string(),
    thumbnail: Joi.string(),
  }),
  constructorImg: Joi.string(),
  additionalPrice: Joi.number()
    .optional()
    .default(0),
  available: Joi.boolean(),
  customizable: Joi.boolean(),
});

const inputConstructorElementValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .uppercase(),
  model: Joi.string(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .required(),
  basePrice: Joi.number()
    .optional()
    .default(0),
  available: Joi.boolean().required(),
  customizable: Joi.boolean(),
});

const inputConstrFrontPocketValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .uppercase(),
  model: Joi.string(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
    pattern: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .required(),
  basePrice: Joi.number()
    .optional()
    .default(0),
  available: Joi.boolean().required(),
  customizable: Joi.boolean(),
});

module.exports = {
  inputPocketValidator,
  inputOptionValidator,
  inputStrapValidator,
  inputPatternValidator,
  inputConstructorElementValidator,
  inputConstrFrontPocketValidator,
};
