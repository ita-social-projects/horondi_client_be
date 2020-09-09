const EmailChatService = require('./email-chat.service');
const {
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');

const emailChatQuestionQuery = {
  getAllEmailQuestions: (parent, args) => EmailChatService.getAllEmailQuestions(),
  getEmailQuestionById: async (parent, args) => {
    const question = await EmailChatService.getEmailQuestionById(args.id);
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
  addEmailQuestion: async (parent, args) => await EmailChatService.addEmailQuestion(args.question),
  spamQuestion: async (parent, args) => {
    try {
      return await EmailChatService.sendEmailQuestionToSpam(args.questionId);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
  deleteEmailQuestion: async (parent, args) => {
    try {
      return await EmailChatService.deleteEmailQuestion(args.id);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
};

module.exports = { emailChatQuestionQuery, emailChatQuestionMutation };
