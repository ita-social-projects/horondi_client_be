const emailChatService = require('./email-chat.service');
const {
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');

const emailChatQuestionQuery = {
  getAllEmailQuestions: (parent, args) => emailChatService.getAllEmailQuestions(),
  getEmailQuestionById: async (parent, args) => {
    const question = await emailChatService.getEmailQuestionById(args.id);
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
  addEmailQuestion: async (parent, args) => await emailChatService.addEmailQuestion(args.question),
  spamQuestion: async (parent, args, context) => {
    try {
      return await emailChatService.sendEmailQuestionToSpam(
        args.questionId,
        context.user,
      );
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
  emailChatAnswer: async (parent, args, context) => {
    try {
      return await emailChatService.giveAnswer(args, context.user);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
  deleteEmailQuestion: async (parent, args) => {
    try {
      return await emailChatService.deleteEmailQuestion(args.id);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
};

module.exports = { emailChatQuestionQuery, emailChatQuestionMutation };
