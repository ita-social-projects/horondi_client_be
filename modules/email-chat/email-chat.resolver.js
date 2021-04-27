const emailChatService = require('./email-chat.service');
const RuleError = require('../../errors/rule.error');
const {
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

const emailChatQuestionQuery = {
  getAllEmailQuestions: (parent, args) =>
    emailChatService.getAllEmailQuestions(args),
  getPendingEmailQuestionsCount: (parent, args) =>
    emailChatService.getPendingEmailQuestionsCount(),
  getEmailQuestionById: async (parent, args) => {
    const question = await emailChatService
      .getEmailQuestionById(args.id)
      .exec();
    if (question) {
      return question;
    }
    return new RuleError(QUESTION_NOT_FOUND, NOT_FOUND);
  },
};

const emailChatQuestionMutation = {
  addEmailQuestion: async (parent, args) =>
    await emailChatService.addEmailQuestion(args.question),

  makeEmailQuestionsSpam: async (parent, args) => {
    try {
      return await emailChatService.makeEmailQuestionsSpam(args);
    } catch (error) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  answerEmailQuestion: async (parent, args) => {
    try {
      return await emailChatService.answerEmailQuestion(args);
    } catch (error) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteEmailQuestions: async (parent, args) => {
    try {
      return await emailChatService.deleteEmailQuestions(
        args.questionsToDelete
      );
    } catch (error) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { emailChatQuestionQuery, emailChatQuestionMutation };
