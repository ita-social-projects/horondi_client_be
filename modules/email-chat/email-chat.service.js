const EmailChat = require('./email-chat.model');

class EmailChatService {
  getEmailChatById(id) {
    return EmailChat.findById(id);
  }

  addEmailChat(data) {
    const emailChat = new EmailChat(data);
    return emailChat.save();
  }
}
module.exports = new EmailChatService();
