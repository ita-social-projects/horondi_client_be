const Joi = require('joi');

const currencyInputValidator = Joi.object({
  lastUpdatedDate: Joi.string().trim().required(),
  convertOptions: Joi.object({
    UAH: {
      name: Joi.string().trim().required(),
      exchangeRate: Joi.number().required(),
    },
    USD: {
      name: Joi.string().trim().required(),
      exchangeRate: Joi.number().required(),
    },
  }),
});

module.exports = {
  currencyInputValidator,
};
