const EmailChat = require('./email-chat.model');
const userService = require('../user/user.service');
const {
  CHAT_NOT_FOUND,
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');
const { sendEmail } = require('../../utils/sendGrid-email');
const { emailQuestionAnswerMessage } = require('../../utils/localization');
const { MAIL_USER } = require('../../dotenvValidator');
const {
  STATUSES: { PENDING, SPAM, ANSWERED },
} = require('../../consts/statuses');
const {
  SERVICES: { ID, DATE, INITIAL_TEXT, UKR, EN },
} = require('../../consts/delivery-services');

class EmailChatService {
  async getAllEmailQuestions({ filter = {}, skip }) {
    const { emailQuestionStatus } = filter;

    const filters = emailQuestionStatus
      ? { status: { $in: emailQuestionStatus } }
      : {};

    const questions = await EmailChat.find(filters)
      .skip(skip || 0)
      .limit(10)
      .sort(DATE)
      .exec();

    const count = await EmailChat.find(filters)
      .countDocuments()
      .exec();

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
    return await EmailChat.find({ status: PENDING })
      .countDocuments()
      .exec();
  }

  addEmailQuestion(data) {
    const emailChat = new EmailChat(data);
    return emailChat.save();
  }

  async makeEmailQuestionsSpam({ questionsToSpam, adminId }) {
    const admin = await userService.getUserByFieldOrThrow(ID, adminId);

    const result = questionsToSpam.map(async id => {
      const question = await EmailChat.findById(id).exec();

      question.status = SPAM;
      question.answer.admin = admin;
      question.answer.text = INITIAL_TEXT;
      question.answer.date = Date.now();

      return await EmailChat.findByIdAndUpdate(id, question, {
        new: true,
      }).exec();
    });

    const updatedQuestions = await Promise.allSettled(result);
    return updatedQuestions.map(item => ({
      ...item.value._doc,
    }));
  }

  async answerEmailQuestion({ questionId, adminId, text }) {
    const question = await this.getEmailQuestionById(questionId).exec();
    const admin = await userService.getUserByFieldOrThrow(ID, adminId);

    if (!question) {
      throw new Error(QUESTION_NOT_FOUND);
    }

    question.status = ANSWERED;
    question.answer.admin = admin;
    question.answer.text = text;
    question.answer.date = Date.now();
    const updatedQuestion = await EmailChat.findByIdAndUpdate(
      questionId,
      question,
      {
        new: true,
      }
    ).exec();

    const language = question.language;
    const subject = `[HORONDI] ${!language ? UKR : EN}`;
    const message = {
      from: MAIL_USER,
      to: question.email,
      subject,
      html: emailQuestionAnswerMessage(updatedQuestion, language),
    };
    await sendEmail(message);

    return updatedQuestion;
  }

  async deleteEmailQuestions(questionsToDelete) {
    try {
      const result = questionsToDelete.map(
        async id => await EmailChat.findByIdAndDelete(id).exec()
      );

      const deletedQuestions = await Promise.allSettled(result);
      return deletedQuestions.map(item => ({
        ...item.value._doc,
      }));
    } catch (e) {
      throw new Error(CHAT_NOT_FOUND);
    }
  }
}

module.exports = new EmailChatService();
