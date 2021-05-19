const Joi = require('joi');

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
};
