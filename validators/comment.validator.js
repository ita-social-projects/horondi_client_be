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

const replyCommentValidator = Joi.object({
  replyText: Joi.string()
    .min(2)
    .max(1000),
  refToReplyComment: Joi.string(),
  answererEmail: Joi.string().email(),
  answererName: Joi.string()
    .min(2)
    .max(20),
  answerer: Joi.string(),
  showReplyComment: Joi.boolean(),
});

module.exports = {
  replyCommentValidator,
  commentValidator,
};
