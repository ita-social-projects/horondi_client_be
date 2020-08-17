const EmailChatService = require('./email-chat.service');
const { CHAT_NOT_FOUND } = require('../../error-messages/email-chat.messages');

const EmailChatQuery = {
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

  // getAllCommentsByProduct: async (parent, args) => {
  //   try {
  //     return await commentsService.getAllCommentsByProduct(args.id);
  //   } catch (error) {
  //     return [
  //       {
  //         statusCode: 404,
  //         message: error.message,
  //       },
  //     ];
  //   }
  // },
};

const EmailChatMutation = {
  addEmailChat: (parent, args) => EmailChatService.addEmailChat(args.chat),
  // deleteComment: async (parent, args) => {
  //   const deletedComment = await commentsService.deleteComment(args.id);
  //   if (deletedComment) {
  //     return deletedComment;
  //   }
  //   return {
  //     statusCode: 404,
  //     message: COMMENT_NOT_FOUND,
  //   };
  // },
  // updateComment: (parent, args) => commentsService.updateComment(args.id, args.comment),
};

module.exports = { EmailChatQuery, EmailChatMutation };
