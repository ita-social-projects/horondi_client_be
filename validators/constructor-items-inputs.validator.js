const Joi = require('joi');
const {
  RESTRICTION_EXPRESSION_NAMES: { IS_EQUAL, IS_NOT_EQUAL },
} = require('../consts/restriction-expression-names');
const {
  additionalPriceInputValidator,
} = require('./additional-price-input.validators');
const { optionType } = require('../consts');

const {
  CONSTRUCTOR_OPTION_TYPES: {
    BACK_OPTION,
    BOTTOM_OPTION,
    CLOSURE,
    CONSTRUCTOR_BASIC,
    CONSTRUCTOR_BOTTOM,
    CONSTRUCTOR_FRONT_POCKET,
    PATTERN,
    POCKET,
    STRAP,
  },
} = require('../consts/constructor-option-types');

const nestedNameValidator = Joi.object({
  lang: Joi.string()
    .trim()
    .required(),
  value: Joi.string()
    .trim()
    .required(),
});
const inputBasicsValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  image: Joi.string()
    .trim()
    .optional(),
  additionalPrice: additionalPriceInputValidator,
  available: Joi.boolean().required(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
  }),
});
const inputPocketValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .valid(POCKET)
    .required(),
  image: Joi.string()
    .trim()
    .optional(),
  additionalPrice: additionalPriceInputValidator,
  restriction: Joi.boolean(),
  positions: Joi.array(),
});

const inputClosureValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .valid(CLOSURE)
    .required(),
  image: Joi.string()
    .trim()
    .optional(),
  additionalPrice: additionalPriceInputValidator,
  available: Joi.boolean().required(),
  model: Joi.string(),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
  }),
  customizable: Joi.boolean(),
});

const inputBackValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .valid(BACK_OPTION, CLOSURE),
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
  additionalPrice: additionalPriceInputValidator,
  available: Joi.boolean().required(),
  customizable: Joi.boolean(),
});

const inputBottomValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .valid(BOTTOM_OPTION),
  features: Joi.object({
    material: Joi.string()
      .trim()
      .required(),
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string(),
  additionalPrice: additionalPriceInputValidator,
  available: Joi.boolean().required(),
});

const inputStrapValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .valid(STRAP)
    .required(),
  features: Joi.object({
    color: Joi.string()
      .trim()
      .required(),
  }),
  image: Joi.string()
    .trim()
    .optional(),
  additionalPrice: additionalPriceInputValidator,
  available: Joi.boolean().required(),
});

const inputPatternValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .valid(PATTERN)
    .required(),
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
  additionalPrice: additionalPriceInputValidator,
  available: Joi.boolean(),
  customizable: Joi.boolean(),
});

const inputConstructorElementValidator = Joi.object({
  name: Joi.array().has(nestedNameValidator),
  optionType: Joi.string()
    .trim()
    .valid(CONSTRUCTOR_BASIC, CONSTRUCTOR_BOTTOM)
    .required(),
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
    .valid(CONSTRUCTOR_FRONT_POCKET)
    .required(),
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
  inputPocketValidator,
  inputBackValidator,
  inputBottomValidator,
  inputStrapValidator,
  inputPatternValidator,
  inputConstructorElementValidator,
  inputConstrFrontPocketValidator,
  restrictionValidator,
  inputClosureValidator,
  inputBasicsValidator,
};
