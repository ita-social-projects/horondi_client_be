const mongoose = require('mongoose');
const { newQuestionsAnswers } = require('./questions-answers.variables');
const { setupApp } = require('../helper-functions');
const {
  addQuestionsAnswers,
  deleteQuestionsAnswers,
  getAllQuestionsAnswers,
  getQuestionsAnswersById,
} = require('./questions-answers.helper');

let questionsAnswers;
let operations;

describe('Questions and answers queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    questionsAnswers = await addQuestionsAnswers(
      newQuestionsAnswers,
      operations
    );
  });
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('Should get all questions and answers', async () => {
    const answers = await getAllQuestionsAnswers(operations);

    expect(answers).toBeDefined();
    expect(answers.items.length).toBe(1);
  });

  it('Should get selected questions and answers', async () => {
    const receivedQuestionsAnswers = await getQuestionsAnswersById(
      questionsAnswers._id,
      operations
    );

    expect(receivedQuestionsAnswers).toBeDefined();
    expect(receivedQuestionsAnswers.question).toBeInstanceOf(Array);
    expect(receivedQuestionsAnswers).toHaveProperty(
      'question',
      newQuestionsAnswers.question
    );
    expect(receivedQuestionsAnswers.answer).toBeInstanceOf(Array);
    expect(receivedQuestionsAnswers).toHaveProperty(
      'answer',
      newQuestionsAnswers.answer
    );
  });

  afterAll(async () => {
    await deleteQuestionsAnswers(questionsAnswers._id, operations);
  });
});
