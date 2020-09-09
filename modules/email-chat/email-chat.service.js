const EmailChat = require('./email-chat.model');
const { CHAT_NOT_FOUND } = require('../../error-messages/email-chat.messages');

class EmailChatService {
  getAllEmailQuestions() {
    return EmailChat.find();
  }

  getEmailQuestionById(id) {
    return EmailChat.findById(id);
  }

  addEmailQuestion(data) {
    const emailChat = new EmailChat(data);
    return emailChat.save();
  }

  async deleteEmailQuestion(id) {
    const deletedChat = await EmailChat.findById(id);
    if (!deletedChat) {
      throw new Error(CHAT_NOT_FOUND);
    }
    return EmailChat.findByIdAndDelete(id);
  }
}
module.exports = new EmailChatService();
