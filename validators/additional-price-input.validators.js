const Joi = require('joi');

const {
  ADDITIONAL_PRICE_TYPES: { ABSOLUTE_INDICATOR, RELATIVE_INDICATOR },
} = require('../consts/additional-price-types');

const additionalPriceInputValidator = Joi.object({
  value: Joi.number().required(),
  type: Joi.string()
    .trim()
    .valid(ABSOLUTE_INDICATOR, RELATIVE_INDICATOR)
    .required(),
});

module.exports = { additionalPriceInputValidator };
