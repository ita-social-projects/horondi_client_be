const EmailChat = require('./email-chat.model');
const {
  CHAT_NOT_FOUND,
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');

class EmailChatService {
  getAllEmailQuestions() {
    return EmailChat.find();
  }

  getEmailQuestionById(id) {
    const question = EmailChat.findById(id);
    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }
    return question;
  }

  addEmailQuestion(data) {
    const emailChat = new EmailChat(data);
    return emailChat.save();
  }

  async sendEmailQuestionToSpam(questionId, adminId) {
    const question = await EmailChat.findById(questionId);
    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }
    question.answer.admin = adminId;
    question.status = 'SPAM';
    question.answer.text = '';
    question.answer.date = Date.now();
    return EmailChat.findByIdAndUpdate(questionId, question, { new: true });
  }

  async giveAnswer(args, adminId) {
    const question = await this.getEmailQuestionById(args.questionId);
    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }
    question.status = 'ANSWERED';
    question.answer.admin = adminId;
    question.answer.text = args.text;
    question.answer.date = Date.now();
    return EmailChat.findByIdAndUpdate(args.questionId, question, {
      new: true,
    });
  }

  async deleteEmailQuestion(id) {
    const deletedChat = await EmailChat.findByIdAndDelete(id);
    if (!deletedChat) {
      throw new Error(CHAT_NOT_FOUND);
    }
    return deletedChat;
  }
}
module.exports = new EmailChatService();
