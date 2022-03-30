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
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

let operations;
let question;
let dateSince;
let senderName;
let text;
let email;
let language;
let filter;
let pagination;

describe('Chat email queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    dateSince = new Date();
    const {
      senderName: _senderName,
      text: _text,
      email: _email,
      language: _language,
    } = emailQuestionInputData;
    senderName = _senderName;
    text = _text;
    email = _email;
    language = _language;
    question = await addEmailQuestion(emailQuestionInputData, operations);
    const { filter: _filter, pagination: _pagination } =
      getFilterPaginationInputData(dateSince);
    filter = _filter;
    pagination = _pagination;
  });

  test('should get email questions', async () => {
    const result = await getAllEmailQuestions(filter, pagination, operations);

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('senderName', senderName);
    expect(result.questions[0]).toHaveProperty('text', text);
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result.questions[0]).toHaveProperty('language', language);
  });

  test('should get email questions (without filter arg)', async () => {
    const result = await getAllEmailQuestions({}, pagination, operations);

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result).toHaveProperty('count', 1);
  });

  test('should get email questions (without filter.emailQuestionStatus arg)', async () => {
    const { search, date } = filter;
    const result = await getAllEmailQuestions(
      { search, date },
      pagination,
      operations
    );

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result).toHaveProperty('count', 1);
  });

  test('should get email questions (without filter.search arg)', async () => {
    const { date, emailQuestionStatus } = filter;
    const result = await getAllEmailQuestions(
      { date, emailQuestionStatus },
      pagination,
      operations
    );

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result).toHaveProperty('count', 1);
  });

  test('should get email questions (without filter.date arg)', async () => {
    const { search, emailQuestionStatus } = filter;
    const result = await getAllEmailQuestions(
      { search, emailQuestionStatus },
      pagination,
      operations
    );

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result).toHaveProperty('count', 1);
  });

  test('should get email questions (without filter.date.dateFrom arg)', async () => {
    const {
      date: { dateTo },
      search,
      emailQuestionStatus,
    } = filter;
    const result = await getAllEmailQuestions(
      { date: { dateTo }, search, emailQuestionStatus },
      pagination,
      operations
    );

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result).toHaveProperty('count', 1);
  });

  test('should get email questions (without filter.date.dateTo arg)', async () => {
    const {
      date: { dateFrom },
      search,
      emailQuestionStatus,
    } = filter;
    const result = await getAllEmailQuestions(
      { date: { dateFrom }, search, emailQuestionStatus },
      pagination,
      operations
    );

    expect(result).toBeDefined();
    expect(result.questions[0]).toHaveProperty('email', email);
    expect(result).toHaveProperty('count', 1);
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
    expect(result).toHaveProperty('statusCode', NOT_FOUND);
  });

  afterAll(async () => {
    await deleteEmailQuestions([question._id], operations);
  });
});
