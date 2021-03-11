const Joi = require('joi');

const { userNameRegExp } = require('../consts/regexp');

const addConstructorBasicValidator = Joi.object({
  name: Joi.array().items(
    { lang: Joi.string() },
    {
      value: Joi.string()
        .trim()
        .regex(userNameRegExp),
    }
  ),
  material: Joi.object().required(),
  color: Joi.object().required(),
  image: Joi.string().required(),
  basePrice: Joi.array().items(
    { currency: Joi.string() },
    { value: Joi.string() }
  ),
});

const updateConstructorBasicValidator = Joi.object({
  name: Joi.array().items(
    { lang: Joi.string() },
    {
      value: Joi.string()
        .trim()
        .regex(userNameRegExp),
    }
  ),
  material: Joi.object().required(),
  color: Joi.object().required(),
  image: Joi.string().required(),
  basePrice: Joi.array().items(
    { currency: Joi.string() },
    { value: Joi.string() }
  ),
});

module.exports = {
  addConstructorBasicValidator,
  updateConstructorBasicValidator,
};
