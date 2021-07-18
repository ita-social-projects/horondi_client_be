const { setupApp } = require('../helper-functions');
const {
  emailQuestionInputData,
  fakeQuestionId,
  getFilterPaginationInputData,
} = require('./email-chat.variables');
const {
  addEmailQuestion,
  getAllEmailQuestions,
  getPendingEmailQuestionsCount,
  getEmailQuestionById,
  deleteEmailQuestions,
} = require('./email-chat.helper');
const {
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');

let operations;
let question;
let dateFrom;
const { senderName, text, email, language } = emailQuestionInputData;

describe('Chat email queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    dateFrom = new Date();
    question = await addEmailQuestion(emailQuestionInputData, operations);
  });

  test('should get email questions', async () => {
    const { filter, pagination } = getFilterPaginationInputData(dateFrom);
    const result = await getAllEmailQuestions(filter, pagination, operations);

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('senderName', senderName);
    expect(result.questions[0]).toHaveProperty('text', text);
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result.questions[0]).toHaveProperty('language', language);
  });

  test('should get count questions', async () => {
    const result = await getPendingEmailQuestionsCount(operations);

    expect(result).toBeDefined();
    expect(result).toBe(1);
  });

  test('should get email question by id', async () => {
    const result = await getEmailQuestionById(question._id, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('senderName', senderName);
    expect(result).toHaveProperty('text', text);
    expect(result).toHaveProperty('email', email);
    expect(result).toHaveProperty('language', language);
  });

  test('should throw "QUESTION_NOT_FOUND" err msg if question id is not exists', async () => {
    const result = await getEmailQuestionById(fakeQuestionId, operations);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', QUESTION_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', 404);
  });

  afterAll(async () => {
    await deleteEmailQuestions([question._id], operations);
  });
});
