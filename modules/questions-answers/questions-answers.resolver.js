const questionsAnswersService = require('./questions-answers.service');

const questionsAnswersQuery = {
  getAllQuestionsAnswers: () => questionsAnswersService.getAllQuestionsAnswers(),

  getQuestionsAnswersById: async (_, { id }) => questionsAnswersService.getQuestionsAnswersById(id),
};

const questionsAnswersMutation = {
  addQuestionsAnswers: async (_, { questionsAnswers }) => questionsAnswersService.addQuestionsAnswers(questionsAnswers),

  deleteQuestionsAnswers: async (_, args) => questionsAnswersService.deleteQuestionsAnswers(args.id),

  updateQuestionsAnswers: async (_, args) => questionsAnswersService.updateQuestionsAnswers(
    args.id,
    args.questionsAnswers,
  ),
};

module.exports = { questionsAnswersQuery, questionsAnswersMutation };
