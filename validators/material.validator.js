const Joi = require('joi');

const {
  materialPurposes: { MAIN, INNER, BOTTOM, PATTERN, CLOSURE },
} = require('../consts/material-purposes');

const {
  name_LANG_MIN_CHARS,
  name_LANG_MAX_CHARS,
  name_VALUE_MIN_CHARS,
  name_VALUE_MAX_CHARS,
  descript_title_text_LANG_MIN_CHARS,
  descript_title_text_LANG_MAX_CHARS,
  descript_title_text_VALUE_MIN_CHARS,
  descript_title_text_VALUE_MAX_CHARS,
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
      descript_title_text_VALUE_MAX_CHARS
    )
  ),
  purpose: Joi.string()
    .trim()
    .valid(MAIN, INNER, BOTTOM, PATTERN, CLOSURE)
    .required(),
  colors: Joi.array().items(Joi.string().required()),
  available: Joi.boolean(),
  additionalPrice: Joi.number().integer(),
});

module.exports = {
  materialInputValidator,
};
