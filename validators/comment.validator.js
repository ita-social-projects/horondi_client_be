const Joi = require('joi');

const replyCommentValidator = Joi.object({
  replyText: Joi.string()
    .min(2)
    .max(1000),
  refToReplyComment: Joi.string(),
  answerer: Joi.string(),
  showReplyComment: Joi.boolean(),
});

module.exports = {
  replyCommentValidator,
};
