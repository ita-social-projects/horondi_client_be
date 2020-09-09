const EmailChatService = require('./email-chat.service');
const { CHAT_NOT_FOUND } = require('../../error-messages/email-chat.messages');

const emailChatQuestionQuery = {
  getAllEmailQuestion: async (parent, args) => await EmailChatService.getAllEmailQuestions(),
  getEmailQuestionById: async (parent, args) => {
    const chat = await EmailChatService.getEmailQuestionById(args.id);
    if (chat) {
      return chat;
    }
    return {
      statusCode: 404,
      message: CHAT_NOT_FOUND,
    };
  },
};

const emailChatQuestionMutation = {
  addEmailQuestion: async (parent, args) => await EmailChatService.addEmailQuestion(args.question),
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