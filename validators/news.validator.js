const Joi = require('joi');

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

const newsInputValidator = Joi.object({
  title: Joi.array().items(
    languageValidator(
      descript_title_text_LANG_MIN_CHARS,
      descript_title_text_LANG_MAX_CHARS,
      descript_title_text_VALUE_MIN_CHARS,
      descript_title_text_VALUE_MAX_CHARS
    )
  ),
  text: Joi.array().items(
    languageValidator(
      descript_title_text_LANG_MIN_CHARS,
      descript_title_text_LANG_MAX_CHARS,
      descript_title_text_VALUE_MIN_CHARS,
      descript_title_text_VALUE_MAX_CHARS
    )
  ),
  author: Joi.object({
    name: Joi.array().items(
      languageValidator(
        name_LANG_MIN_CHARS,
        name_LANG_MAX_CHARS,
        name_VALUE_MIN_CHARS,
        name_VALUE_MAX_CHARS
      )
    ),
    image: Joi.any(),
  }),
  image: Joi.any(),
  date: Joi.string().trim(),
  show: Joi.boolean(),
  languages: Joi.array().items(Joi.string().trim()),
});

module.exports = {
  newsInputValidator,
};
