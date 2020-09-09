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

  async sendEmailQuestionToSpam(questionId) {
    const question = await EmailChat.findById(questionId);
    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }
    question.status = 'SPAM';
    return EmailChat.findByIdAndUpdate(questionId, question, { new: true });
  }

  async giveAnswer(args, userId) {
    const question = await this.getEmailQuestionById(args.questionId);
    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }
    question.answer.user = '5f47531b5c5f312d08eb7dd5';
    // question.answer.user = userId
    question.answer.status = 'ANSWERED';
    question.answer.text = args.text;
    return EmailChat.findByIdAndUpdate(args.questionId, question, {
      new: true,
    });
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
