const EmailChat = require('./email-chat.model');
const userService = require('../user/user.service');
const {
  CHAT_NOT_FOUND,
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');

class EmailChatService {
  async getAllEmailQuestions({ filter = {}, skip }) {
    const { emailQuestionStatus } = filter;

    const filters = emailQuestionStatus
      ? { status: { $in: emailQuestionStatus } }
      : {};

    const questions = await EmailChat.find(filters)
      .skip(skip || 0)
      .limit(10)
      .sort('-date');

    const count = await EmailChat.find(filters).countDocuments();
    const paginatedCount = this.getPendingEmailQuestionsCount();

    return {
      questions,
      count,
    };
  }

  getEmailQuestionById(id) {
    const question = EmailChat.findById(id);
    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }
    return question;
  }

  async getPendingEmailQuestionsCount() {
    return await EmailChat.find({ status: 'PENDING' }).countDocuments();
  }

  addEmailQuestion(data) {
    const emailChat = new EmailChat(data);
    return emailChat.save();
  }

  async makeQuestionSpam({ questionId, adminId }) {
    const question = await EmailChat.findById(questionId);
    const admin = await userService.getUserByFieldOrThrow('_id', adminId);

    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }

    question.status = 'SPAM';
    question.answer.admin = admin;
    question.answer.text = '';
    question.answer.date = Date.now();
    return EmailChat.findByIdAndUpdate(questionId, question, { new: true });
  }

  async answerEmailQuestion({ questionId, adminId, text }) {
    const question = await this.getEmailQuestionById(questionId);
    const admin = await userService.getUserByFieldOrThrow('_id', adminId);

    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }
    question.status = 'ANSWERED';
    question.answer.admin = admin;
    question.answer.text = text;
    question.answer.date = Date.now();
    return EmailChat.findByIdAndUpdate(questionId, question, {
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
