const Joi = require('joi');

const name_LANG_MIN_CHARS = 2;
const name_LANG_MAX_CHARS = 2;
const name_VALUE_MIN_CHARS = 2;
const name_VALUE_MAX_CHARS = 30;
const descript_title_text_LANG_MIN_CHARS = 2;
const descript_title_text_LANG_MAX_CHARS = 2;
const descript_title_text_VALUE_MIN_CHARS = 2;
const descript_title_VALUE_MAX_CHARS = 1000;
const text_VALUE_MAX_CHARS = 5000;

const languageValidator = function langValidator(
  langMin,
  langMax,
  valueMin,
  valueMax
) {
  return {
    lang: Joi.string().min(langMin).max(langMax).required(),
    value: Joi.string().min(valueMin).max(valueMax).required(),
  };
};

module.exports = {
  name_LANG_MIN_CHARS,
  name_LANG_MAX_CHARS,
  name_VALUE_MIN_CHARS,
  name_VALUE_MAX_CHARS,
  descript_title_text_LANG_MIN_CHARS,
  descript_title_text_LANG_MAX_CHARS,
  descript_title_text_VALUE_MIN_CHARS,
  descript_title_VALUE_MAX_CHARS,
  text_VALUE_MAX_CHARS,
  languageValidator,
};
