const Joi = require('joi');

const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, CLOSURE },
} = require('../consts/material-purposes');

const {
  ADDITIONAL_PRICE_TYPES: { RELATIVE_INDICATOR, ABSOLUTE_INDICATOR },
} = require('../consts/additional-price-types');

const {
  name_LANG_MIN_CHARS,
  name_LANG_MAX_CHARS,
  name_VALUE_MIN_CHARS,
  name_VALUE_MAX_CHARS,
  descript_title_text_LANG_MIN_CHARS,
  descript_title_text_LANG_MAX_CHARS,
  descript_title_text_VALUE_MIN_CHARS,
  descript_title_VALUE_MAX_CHARS,
  languageValidator,
} = require('./language.validator');

const materialInputValidator = Joi.object({
  name: Joi.array().items(
    languageValidator(
      name_LANG_MIN_CHARS,
      name_LANG_MAX_CHARS,
      name_VALUE_MIN_CHARS,
      name_VALUE_MAX_CHARS
    )
  ),
  description: Joi.array().items(
    languageValidator(
      descript_title_text_LANG_MIN_CHARS,
      descript_title_text_LANG_MAX_CHARS,
      descript_title_text_VALUE_MIN_CHARS,
      descript_title_VALUE_MAX_CHARS
    )
  ),
  purpose: Joi.string()
    .trim()
    .valid(MAIN, INNER, BOTTOM, PATTERN, CLOSURE)
    .required(),
  colors: Joi.array().items(Joi.string().required()),
  available: Joi.boolean(),
  additionalPrice: Joi.object({
    value: Joi.number(),
    type: Joi.string().trim().valid(RELATIVE_INDICATOR, ABSOLUTE_INDICATOR),
  }).required(),
});

module.exports = {
  materialInputValidator,
};
