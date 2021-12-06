const questionsAnswersService = require('./questions-answers.service');

const questionsAnswersQuery = {
  getAllQuestionsAnswers: () =>
    questionsAnswersService.getAllQuestionsAnswers(),
};

const questionsAnswersMutation = {
  addQuestionsAnswers: async (_, { questionsAnswers }) =>
    await questionsAnswersService.addQuestionsAnswers(questionsAnswers),

  deleteQuestionsAnswers: async (_, args) =>
    await questionsAnswersService.deleteQuestionsAnswers(args.id),

  updateQuestionsAnswers: async (_, args) =>
    await questionsAnswersService.updateQuestionsAnswers(
      args.id,
      args.questionsAnswers
    ),
};

module.exports = { questionsAnswersQuery, questionsAnswersMutation };
