const Joi = require('joi');
const {
  SIDES: { LEFT, RIGHT, BACK, FRONT },
} = require('../consts/side-names');
const {
  RESTRICTION_EXPRESSION_NAMES: { IS_EQUAL, IS_NOT_EQUAL },
} = require('../consts/restriction-expression-names');

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

const crudPocketValidator = Joi.object({
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
  default: Joi.boolean(),
});

const crudBackValidator = Joi.object({
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
  default: Joi.boolean(),
});

const crudClosureValidator = Joi.object({
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
  default: Joi.boolean(),
});

const crudStrapValidator = Joi.object({
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
  default: Joi.boolean(),
});

const crudPatternValidator = Joi.object({
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
  default: Joi.boolean(),
});

const crudConstructorBasicValidator = Joi.object({
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
  default: Joi.boolean(),
});

const crudConstructorBottomValidator = Joi.object({
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
  default: Joi.boolean(),
});

const crudConstrFrontPocketValidator = Joi.object({
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
  default: Joi.boolean(),
});

module.exports = {
  crudPocketValidator,
  crudBackValidator,
  crudClosureValidator,
  crudStrapValidator,
  crudPatternValidator,
  crudConstructorBasicValidator,
  crudConstructorBottomValidator,
  crudConstrFrontPocketValidator,
};
