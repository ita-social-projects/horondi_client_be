const Joi = require('joi');
const { enLanguageRegExp, uaLanguageRegExp } = require('../consts/regexp');

const headerInputValidator = Joi.object({
  title: Joi.array().items({
    lang: Joi.string()
      .trim()
      .regex(enLanguageRegExp || uaLanguageRegExp)
      .required(),
    value: Joi.string()
      .min(2)
      .required(),
  }),
  link: Joi.string()
    .min(1)
    .trim()
    .required(),
  priority: Joi.number(),
});

module.exports = {
  headerInputValidator,
};
