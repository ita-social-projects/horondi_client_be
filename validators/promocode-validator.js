const Joi = require('joi');

const promoCodeInputValidator = Joi.object({
  dateFrom: Joi.date().required(),
  dateTo: Joi.date().greater(Joi.ref('dateFrom')).required(),
  code: Joi.string().alphanum().min(2).max(30).required(),
  discount: Joi.number().integer().positive().less(91).required(),
  categories: Joi.array()
    .items(Joi.string().min(3).max(15).required())
    .required(),
});

module.exports = {
  promoCodeInputValidator,
};
