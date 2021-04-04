const Joi = require('joi');

const {
  SIDES: { LEFT, RIGHT, BACK, FRONT },
} = require('../consts/side-names');

const nestedSideValidator = Joi.string()
  .trim()
  .valid(RIGHT, LEFT, FRONT, BACK)
  .required();

const nestedPriceValidator = Joi.object({
  currency: Joi.string()
    .trim()
    .required(),
  value: Joi.number()
    .optional()
    .default(0),
});

const nestedNameValidator = Joi.object({
  lang: Joi.string()
    .trim()
    .required(),
  value: Joi.string()
    .trim()
    .required(),
});

const pocketValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
  features: Joi.Object({
    side: nestedSideValidator,
  }),
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array().has(nestedPriceValidator),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const backValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
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
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const closureValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
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
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const strapValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
  features: Joi.object({
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const patternValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    handmade: Joi.boolean().required(),
  }),
  description: Joi.array().has(nestedNameValidator),
  images: Joi.object({
    large: Joi.string()
      .trim()
      .required(),
    medium: Joi.string()
      .trim()
      .required(),
    small: Joi.string()
      .trim()
      .required(),
    thumbnail: Joi.string()
      .trim()
      .required(),
  }),
  constructorImg: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const constructorBasicValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
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
  basePrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const constructorBottomValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
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
  basePrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const constructorFrontPocketValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .required()
    .uppercase(),
  model: Joi.string().required(),
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
  basePrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

const sizeValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  simpleName: Joi.array().has(nestedNameValidator),
  model: Joi.string().required(),
  heightInCm: Joi.number()
    .integer()
    .required(),
  widthInCm: Joi.number()
    .integer()
    .required(),
  depthInCm: Joi.number()
    .integer()
    .required(),
  volumeInLiters: Joi.number()
    .integer()
    .required(),
  weightInKg: Joi.number().required(),
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
});

module.exports = {
  pocketValidator,
  backValidator,
  closureValidator,
  strapValidator,
  patternValidator,
  constructorBasicValidator,
  constructorBottomValidator,
  constructorFrontPocketValidator,
  sizeValidator,
};
