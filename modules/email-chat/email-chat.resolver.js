const emailChatService = require('./email-chat.service');
const RuleError = require('../../errors/rule.error');

const emailChatQuestionQuery = {
  getAllEmailQuestions: (_, args) =>
    emailChatService.getAllEmailQuestions(args),
  getPendingEmailQuestionsCount: () =>
    emailChatService.getPendingEmailQuestionsCount(),
  getEmailQuestionById: async (_, args) => {
    try {
      return await emailChatService.getEmailQuestionById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const emailChatQuestionMutation = {
  addEmailQuestion: async (_, args) =>
    emailChatService.addEmailQuestion(args.question),

  makeEmailQuestionsSpam: async (_, args) => {
    try {
      return await emailChatService.makeEmailQuestionsSpam(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  answerEmailQuestion: async (_, args) => {
    try {
      return await emailChatService.answerEmailQuestion(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteEmailQuestions: async (_, args) => {
    try {
      return await emailChatService.deleteEmailQuestions(
        args.questionsToDelete
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { emailChatQuestionQuery, emailChatQuestionMutation };
