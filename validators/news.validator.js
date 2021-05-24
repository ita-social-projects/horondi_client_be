const Joi = require('joi');

const languageSchemaValidator = {
  lang: Joi.string()
    .min(0)
    .max(2)
    .required(),
  value: Joi.string()
    .min(6)
    .max(1000)
    .required(),
};

const newsInputValidator = Joi.object({
  title: Joi.array().items(languageSchemaValidator),
  text: Joi.array().items(languageSchemaValidator),
  author: Joi.object({
    name: Joi.array().items(languageSchemaValidator),
  }),
  date: Joi.string().trim(),
  show: Joi.boolean(),
  languages: Joi.array().items(Joi.string().trim()),
});

module.exports = {
  newsInputValidator,
};
