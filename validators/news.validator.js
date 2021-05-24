const Joi = require('joi');

const { languageValidator } = require('./language.validator');

const newsInputValidator = Joi.object({
  title: Joi.array().items(languageValidator(2, 2, 6, 1000)),
  text: Joi.array().items(languageValidator(2, 2, 6, 1000)),
  author: Joi.object({
    name: Joi.array().items(languageValidator(2, 2, 6, 30)),
  }),
  date: Joi.string().trim(),
  show: Joi.boolean(),
  languages: Joi.array().items(Joi.string().trim()),
});

module.exports = {
  newsInputValidator,
};
