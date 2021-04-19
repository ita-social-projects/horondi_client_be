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

const nestedPriceValidator = Joi.object({
  currency: Joi.string(),
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
    .uppercase(),
  model: Joi.string(),
  features: nestedSideValidator,
  image: Joi.string()
    .trim()
    .required(),
  additionalPrice: Joi.array().has(nestedPriceValidator),
  available: Joi.boolean().required(),
  default: Joi.boolean(),
});

const backValidator = Joi.object({
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
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean(),
});

const closureValidator = Joi.object({
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
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean(),
});

const addClosureValidator = Joi.object({
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

const strapValidator = Joi.object({
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
  additionalPrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean(),
});

const patternValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .uppercase(),
  model: Joi.string(),
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
  available: Joi.boolean(),
  default: Joi.boolean(),
});

const constructorBasicValidator = Joi.object({
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
  basePrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean(),
});

const constructorBottomValidator = Joi.object({
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
  basePrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean(),
});

const constructorFrontPocketValidator = Joi.object({
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
  basePrice: Joi.array()
    .has(nestedPriceValidator)
    .optional(),
  available: Joi.boolean().required(),
  default: Joi.boolean(),
});

const restrictionValidator = Joi.object({
  compareByExpression: Joi.string()
    .trim()
    .valid(IS_EQUAL, IS_NOT_EQUAL)
    .required(),
  options: Joi.array().items(
    Joi.object({
      option: Joi.string()
        .trim()
        .required(),
      feature: Joi.string()
        .trim()
        .required(),
    })
  ),
});

module.exports = {
  pocketValidator,
  backValidator,
  closureValidator,
  addClosureValidator,
  strapValidator,
  patternValidator,
  constructorBasicValidator,
  constructorBottomValidator,
  constructorFrontPocketValidator,
  restrictionValidator,
};
