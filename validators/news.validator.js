const Joi = require('joi');

const schemaValidator = {
  lang: Joi.string()
    .min(2)
    .max(2)
    .required(),
  value: Joi.string()
    .min(6)
    .max(1000)
    .required(),
};

const newsInputValidator = Joi.object({
  title: Joi.array().items(schemaValidator),
  text: Joi.array().items(schemaValidator),
  author: Joi.object({
    name: Joi.array().items(schemaValidator),
  }),
  date: Joi.string().trim(),
  show: Joi.boolean(),
  languages: Joi.array().items(Joi.string().trim()),
});

module.exports = {
  newsInputValidator,
};
