const Joi = require('joi');

const { userNameRegExp } = require('../consts/regexp');

const constructorValidator = Joi.object({
  name: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .regex(userNameRegExp),
  }),
  material: Joi.object().required(),
  color: Joi.object().required(),
  image: Joi.string().required(),
  basePrice: Joi.array().items(
    { currency: Joi.string() },
    { value: Joi.string() }
  ),
});

module.exports = {
  constructorValidator,
};
