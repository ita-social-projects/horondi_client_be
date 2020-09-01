const emailChatService = require('./email-chat.service');
const { CHAT_NOT_FOUND } = require('../../error-messages/email-chat.messages');

const emailChatQuery = {
  getAllEmailChats: async (parent, args) => await emailChatService.getAllChats(),
  getEmailChatById: async (parent, args) => {
    const chat = await emailChatService.getEmailChatById(args.id);
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
  addEmailChat: async (parent, args) => await emailChatService.addEmailChat(args.chat),
  updateEmailChat: async (parent, args) => {
    try {
      return await emailChatService.updateEmailChat(args.id, args.chat);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
  deleteEmailChat: async (parent, args) => {
    try {
      return await emailChatService.deleteEmailChat(args.id);
    } catch (error) {
      return {
        statusCode: 404,
        message: error.message,
      };
    }
  },
};

module.exports = { emailChatQuery, emailChatMutation };
