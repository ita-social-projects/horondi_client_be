const emailChatService = require('./email-chat.service');
const RuleError = require('../../errors/rule.error');
const {
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

const emailChatQuestionQuery = {
  getAllEmailQuestions: async (parent, args) => {
    try {
      return await emailChatService.getAllEmailQuestions(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPendingEmailQuestionsCount: async (parent, args) => {
    try {
      return await emailChatService.getPendingEmailQuestionsCount();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getEmailQuestionById: async (parent, args) => {
    try {
      const question = await emailChatService
        .getEmailQuestionById(args.id)
        .exec();
      if (question) {
        return question;
      }
    } catch (e) {
      return new RuleError(QUESTION_NOT_FOUND, NOT_FOUND);
    }
  },
};

const emailChatQuestionMutation = {
  addEmailQuestion: async (parent, args) => {
    try {
      return await emailChatService.addEmailQuestion(args.question);
    } catch (e) {
      return new RuleError(QUESTION_NOT_FOUND, NOT_FOUND);
    }
  },
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
