const Joi = require('joi');

const sizeInputValidator = Joi.object({
  name: Joi.string()
    .min(1)
    .max(3)
    .required(),
  simpleName: Joi.array().items({
    lang: Joi.string()
      .trim()
      .required(),
    value: Joi.string()
      .trim()
      .required(),
  }),
  heightInCm: Joi.number()
    .integer()
    .min(1)
    .max(35)
    .required(),
  widthInCm: Joi.number()
    .integer()
    .min(1)
    .max(35)
    .required(),
  depthInCm: Joi.number()
    .integer()
    .min(1)
    .max(35)
    .required(),
  volumeInLiters: Joi.number()
    .integer()
    .min(1)
    .max(35)
    .required(),
  weightInKg: Joi.number()
    .min(0.1)
    .max(5)
    .required(),
  available: Joi.boolean().required(),
  additionalPrice: Joi.number()
    .integer()
    .required(),
});

module.exports = {
  sizeInputValidator,
};
