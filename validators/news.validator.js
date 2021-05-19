const Joi = require('joi');

const languageSchemaValidator = {
  lang: Joi.string()
    .trim()
    .required(),
  value: Joi.string().trim(),
};

const newsInputValidator = Joi.object({
  title: Joi.array().items(languageSchemaValidator),
  text: Joi.array().items(languageSchemaValidator),
  image: Joi.string().trim(),
  author: Joi.object({
    name: Joi.array().items(languageSchemaValidator),
    image: Joi.string().trim(),
  }),
  date: Joi.string().trim(),
  show: Joi.boolean(),
  languages: Joi.array().items(Joi.string().trim()),
});

module.exports = {
  newsInputValidator,
};
