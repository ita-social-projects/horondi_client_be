const {
  newQuestionsAnswers,
  updateQuestionsAnswersInput,
} = require('./questions-answers.variables');
const { setupApp } = require('../helper-functions');
const {
  addQuestionsAnswers,
  updateQuestionsAnswers,
  deleteQuestionsAnswers,
} = require('./questions-answers.helper');

let questionsAnswers;
let questionsAnswersId;
let operations;

describe('Questionsa and answers queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  it('should add questions and answers to database', async () => {
    questionsAnswers = await addQuestionsAnswers(
      newQuestionsAnswers,
      operations
    );
    questionsAnswersId = questionsAnswers._id;

    expect(questionsAnswers).toHaveProperty(
      'question',
      newQuestionsAnswers.question
    );
    expect(questionsAnswers.question).toBeInstanceOf(Array);
    expect(questionsAnswers).toHaveProperty(
      'answer',
      newQuestionsAnswers.answer
    );
    expect(questionsAnswers.answer).toBeInstanceOf(Array);
  });

  it('update questions and answers', async () => {
    const receivedQuestionsAnswers = await updateQuestionsAnswers(
      questionsAnswersId,
      updateQuestionsAnswersInput,
      operations
    );

    expect(receivedQuestionsAnswers).toHaveProperty(
      'question',
      updateQuestionsAnswersInput.question
    );
    expect(receivedQuestionsAnswers).toHaveProperty(
      'answer',
      updateQuestionsAnswersInput.answer
    );
  });

  it('delete questionsAnswers', async () => {
    const res = await deleteQuestionsAnswers(questionsAnswersId, operations);

    questionsAnswers = res.data.deleteQuestionsAnswers;
    expect(questionsAnswers.question).toBeInstanceOf(Array);
    expect(questionsAnswers).toHaveProperty(
      'question',
      updateQuestionsAnswersInput.question
    );
    expect(questionsAnswers).toHaveProperty(
      'answer',
      updateQuestionsAnswersInput.answer
    );
  });
});
