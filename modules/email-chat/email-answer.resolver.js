const EmailChatService = require('./email-chat.service');

const emailChatAnswerMutation = {
  emailChatAnswer: async (parent, args, context) => {
    try {
      return await EmailChatService.giveAnswer(args, context.user);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
};

module.exports = { emailChatAnswerMutation };
