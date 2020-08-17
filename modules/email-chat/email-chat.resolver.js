const EmailChatService = require('./email-chat.service');
const { CHAT_NOT_FOUND } = require('../../error-messages/email-chat.messages');

const emailChatQuery = {
  getEmailChatById: async (parent, args) => {
    const chat = await EmailChatService.getEmailChatById(args.id);
    if (chat) {
      return chat;
    }
    return {
      statusCode: 404,
      message: CHAT_NOT_FOUND,
    };
  },
};

const emailChatMutation = {
  addEmailChat: async (parent, args) => await EmailChatService.addEmailChat(args.chat),
};

module.exports = { emailChatQuery, emailChatMutation };
