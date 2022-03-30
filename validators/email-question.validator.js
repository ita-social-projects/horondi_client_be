const Joi = require('joi');
const { emailRegExp } = require('../consts/regexp');

const questionInputValidator = Joi.object({
  senderName: Joi.string().min(2).max(30).trim().required(),
  text: Joi.string().min(2).trim().required(),
  email: Joi.string().trim().regex(emailRegExp).required(),
  language: Joi.number().valid(0, 1).required(),
});

const answerInputValidator = Joi.string().min(1).required();

module.exports = {
  questionInputValidator,
  answerInputValidator,
};
