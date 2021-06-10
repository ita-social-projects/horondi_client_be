const Joi = require('joi');

const commentValidator = Joi.object({
  text: Joi.string()
    .trim()
    .min(2)
    .required(),
  user: Joi.string().required(),
  product: Joi.string().required(),
  show: Joi.boolean(),
  rate: Joi.number().valid(0, 1, 2, 3, 4, 5),
});

const replyCommentValidator = Joi.object({
  replyText: Joi.string()
    .min(2)
    .required(),
  refToReplyComment: Joi.string(),
  answerer: Joi.string(),
  showReplyComment: Joi.boolean(),
  productId: Joi.string(),
});

module.exports = {
  replyCommentValidator,
  commentValidator,
};
