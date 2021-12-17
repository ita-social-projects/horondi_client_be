const QuestionsAnswers = require('./questions-answers.model');

const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class QuestionsAnswersService {
  async getAllQuestionsAnswers() {
    const items = await QuestionsAnswers.find().exec();
    return {
      items,
    };
  }

  async getQuestionsAnswersById(id) {
    const questionsAnswers = await QuestionsAnswers.findById(id).exec();
    if (questionsAnswers) {
      return questionsAnswers;
    }
  }

  async updateQuestionsAnswers(id, questionsAnswers) {
    const foundQuestionsAnswers = await QuestionsAnswers.findById(id).exec();
    await updateTranslations(
      foundQuestionsAnswers.translationsKey,
      createTranslations(questionsAnswers),
    );
    const newPage = questionsAnswers;

    const page = await QuestionsAnswers.findByIdAndUpdate(id, newPage, {
      new: true,
    }).exec();

    return page || null;
  }

  async addQuestionsAnswers(questionsAnswers) {
    questionsAnswers.translationsKey = await addTranslations(
      createTranslations(questionsAnswers),
    );

    return new QuestionsAnswers(questionsAnswers).save();
  }

  async deleteQuestionsAnswers(id) {
    const questionsAnswers = await QuestionsAnswers.findByIdAndDelete(
      id,
    ).exec();

    if (questionsAnswers) {
      await deleteTranslations(questionsAnswers.translationsKey);

      return questionsAnswers;
    }
  }
}

module.exports = new QuestionsAnswersService();
