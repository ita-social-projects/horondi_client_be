const EmailChat = require('./email-chat.model');
const userService = require('../user/user.service');
const {
  CHAT_NOT_FOUND,
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');
const {
  EmailActions: { SEND_EMAIL_ANSWER },
} = require('../../consts/email-actions');
const {
  EMAIL_MESSAGES_STATUSES: { SPAM, ANSWERED },
} = require('../../consts/email-statuses');
const {
  DELIVERY_SERVICES_INITIAL_VALUES: { ID, DATE, INITIAL_TEXT },
} = require('../../consts/delivery-services');
const { minDefaultDate } = require('../../consts/date-range');
const emailService = require('../email/email.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');

class EmailChatService {
  async getAllEmailQuestions({ filter = {}, pagination: { skip, limit } }) {
    const { emailQuestionStatus, search, date } = filter;
    let maxDate = new Date();
    let minDate = minDefaultDate;

    const filterOptions = {};

    if (emailQuestionStatus) {
      filterOptions.status = { $in: emailQuestionStatus };
    }

    if (date?.dateFrom) {
      minDate = new Date(filter.date.dateFrom);
    }

    if (date?.dateTo) {
      maxDate = new Date(filter.date.dateTo);
    }

    filterOptions.date = {
      $gte: minDate,
      $lte: maxDate,
    };

    if (search && search.trim()) {
      const searchItem = filter.search.trim();
      filterOptions.$or = [
        { senderName: { $regex: new RegExp(searchItem, 'i') } },
        { text: { $regex: new RegExp(searchItem, 'i') } },
        { email: { $regex: new RegExp(searchItem, 'i') } },
      ];
    }

    const questions = await EmailChat.find(filterOptions)
      .skip(skip || 0)
      .limit(limit)
      .sort(DATE)
      .exec();

    const count = await EmailChat.find(filterOptions)
      .countDocuments()
      .exec();

    return {
      questions,
      count,
    };
  }

  async getEmailQuestionById(id) {
    const question = await EmailChat.findById(id).exec();
    if (!question) {
      throw new RuleError(QUESTION_NOT_FOUND, NOT_FOUND);
    }

    return question;
  }

  async getPendingEmailQuestionsCount() {
    return EmailChat.find({ status: 'PENDING' })
      .countDocuments()
      .exec();
  }

  addEmailQuestion(data) {
    const emailChat = new EmailChat(data);

    return emailChat.save();
  }

  async makeEmailQuestionsSpam({ questionsToSpam, adminId }) {
    const admin = await userService.getUserByFieldOrThrow(ID, adminId);

    const result = questionsToSpam.map(async (id) => {
      const question = await EmailChat.findById(id).exec();

      question.status = SPAM;
      question.answer.admin = admin;
      question.answer.text = INITIAL_TEXT;
      question.answer.date = Date.now();

      return EmailChat.findByIdAndUpdate(id, question, {
        new: true,
      }).exec();
    });

    const updatedQuestions = await Promise.allSettled(result);

    return updatedQuestions.map((item) => ({
      ...item.value._doc,
    }));
  }

  async answerEmailQuestion({ questionId, adminId, text }) {
    const question = await this.getEmailQuestionById(questionId);
    if (!question) {
      throw new RuleError(QUESTION_NOT_FOUND, BAD_REQUEST);
    }
    const admin = await userService.getUserByFieldOrThrow(ID, adminId);
    const { language, email, senderName, text: emailContent } = question;

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

    await emailService.sendEmail(email, SEND_EMAIL_ANSWER, {
      language,
      senderName,
      question: emailContent,
      answer: text,
      admin,
    });

    return updatedQuestion;
  }

  async deleteEmailQuestions(questionsToDelete) {
    try {
      const result = questionsToDelete.map(async (id) =>
        EmailChat.findByIdAndDelete(id).exec()
      );

      const deletedQuestions = await Promise.allSettled(result);

      return deletedQuestions.map((item) => ({
        ...item.value._doc,
      }));
    } catch (e) {
      throw new RuleError(CHAT_NOT_FOUND, NOT_FOUND);
    }
  }
}

module.exports = new EmailChatService();
