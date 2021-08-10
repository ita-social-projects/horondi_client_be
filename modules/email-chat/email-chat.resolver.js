const emailChatService = require('./email-chat.service');
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
    return {
      statusCode: NOT_FOUND,
      message: QUESTION_NOT_FOUND,
    };
  },
};

const emailChatQuestionMutation = {
  addEmailQuestion: async (parent, args) =>
    emailChatService.addEmailQuestion(args.question),

  makeEmailQuestionsSpam: async (parent, args) => {
    try {
      return await emailChatService.makeEmailQuestionsSpam(args);
    } catch (error) {
      return {
        statusCode: NOT_FOUND,
        message: error.message,
      };
    }
  },

  answerEmailQuestion: async (parent, args) => {
    try {
      return await emailChatService.answerEmailQuestion(args);
    } catch (error) {
      return {
        statusCode: NOT_FOUND,
        message: error.message,
      };
    }
  },
  deleteEmailQuestions: async (parent, args) => {
    try {
      return await emailChatService.deleteEmailQuestions(
        args.questionsToDelete
      );
    } catch (error) {
      return {
        statusCode: NOT_FOUND,
        message: error.message,
      };
    }
  },
};

module.exports = { emailChatQuestionQuery, emailChatQuestionMutation };
