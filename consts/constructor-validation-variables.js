const Joi = require('joi');

const { userNameRegExp } = require('./regexp');

const constructorJoiValidator = Joi.object({
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
  constructorJoiValidator,
};
