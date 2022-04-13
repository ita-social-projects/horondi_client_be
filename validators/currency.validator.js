const Joi = require('joi');

const currencyInputValidator = Joi.object({
  lastUpdatedDate: Joi.string().trim().required(),
  convertOptions: Joi.array().items({
    name: Joi.string().trim().required(),
    exchangeRate: Joi.number().required(),
  }),
});

module.exports = {
  currencyInputValidator,
};
