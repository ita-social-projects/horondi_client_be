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
    const updatedChat = await EmailChat.findById(id);
    if (!updatedChat) {
      throw new Error(CHAT_NOT_FOUND);
    }
    return EmailChat.findByIdAndUpdate(id, chat, { new: true });
  }

  async deleteEmailChat(id) {
    const deletedChat = await EmailChat.findById(id);
    if (!deletedChat) {
      throw new Error(CHAT_NOT_FOUND);
    }
    return EmailChat.findByIdAndDelete(id);
  }
}
module.exports = new EmailChatService();
