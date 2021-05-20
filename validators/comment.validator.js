const Joi = require('joi');
const commentValidator = Joi.object({
  text: Joi.string()
    .trim()
    .min(2)
    .max(700),
  user: Joi.string().required(),
  product: Joi.string().required(),
  show: Joi.boolean(),
});

module.exports = {
  commentValidator,
};
