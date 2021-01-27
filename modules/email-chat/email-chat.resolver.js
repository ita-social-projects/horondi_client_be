const emailChatService = require('./email-chat.service');
const {
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');

const emailChatQuestionQuery = {
  getAllEmailQuestions: (parent, args) =>
    emailChatService.getAllEmailQuestions(args),
  getPendingEmailQuestionsCount: (parent, args) =>
    emailChatService.getPendingEmailQuestionsCount(),
  getEmailQuestionById: async (parent, args) => {
    const question = emailChatService.getEmailQuestionById(args.id);
    if (question) {
      return question;
    }
    return {
      statusCode: 404,
      message: QUESTION_NOT_FOUND,
    };
  },
};

const emailChatQuestionMutation = {
  addEmailQuestion: async (parent, args) =>
    await emailChatService.addEmailQuestion(args.question),

  makeEmailQuestionsSpam: async (parent, args) => {
    try {
      return await emailChatService.makeEmailQuestionsSpam(args);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },

  answerEmailQuestion: async (parent, args) => {
    try {
      return await emailChatService.answerEmailQuestion(args);
    } catch (error) {
      return {
        statusCode: 404,
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
        statusCode: 404,
        message: error.message,
      };
    }
  },
};

module.exports = { emailChatQuestionQuery, emailChatQuestionMutation };
