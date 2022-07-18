const Joi = require('joi');

const sizeInputValidator = Joi.object({
  _id: Joi.string(),
  name: Joi.string().min(1).max(3).required(),
  heightInCm: Joi.number().integer().min(1).max(35).required(),
  widthInCm: Joi.number().integer().min(1).max(35).required(),
  depthInCm: Joi.number().integer().min(1).max(35).required(),
  volumeInLiters: Joi.number().integer().min(1).max(35).required(),
  weightInKg: Joi.number().min(0.1).max(5).required(),
  available: Joi.boolean().required(),
  absolutePrice: Joi.number().integer().allow(null),
  relativePrice: Joi.number().integer().allow(null),
});

module.exports = {
  sizeInputValidator,
};
