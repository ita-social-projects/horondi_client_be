const EmailChat = require('./email-chat.model');
const { CHAT_NOT_FOUND } = require('../../error-messages/email-chat.messages');

class EmailChatService {
  getAllChats() {
    return EmailChat.find();
  }

  getEmailChatById(id) {
    return EmailChat.findById(id);
  }

  addEmailChat(data) {
    const emailChat = new EmailChat(data);
    return emailChat.save();
  }

  async updateEmailChat(id, chat) {
    const chatToUpdate = await EmailChat.findById(id);
    if (chatToUpdate) {
      return EmailChat.findByIdAndUpdate(id, chat, { new: true });
    }
    throw new Error(CHAT_NOT_FOUND);
  }

  async deleteEmailChat(id) {
    const chatToUpdate = await EmailChat.findById(id);
    if (chatToUpdate) {
      return EmailChat.findByIdAndDelete(id);
    }
    throw new Error(CHAT_NOT_FOUND);
  }
}
module.exports = new EmailChatService();
