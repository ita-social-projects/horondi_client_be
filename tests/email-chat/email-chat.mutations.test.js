const { setupApp } = require('../helper-functions');
const {
  emailQuestionInputData,
  fakeQuestionId,
  fakeAnswer,
} = require('./email-chat.variables');
const { superAdminUser } = require('../user/user.variables');
const { loginAdmin } = require('../user/user.helper');
const {
  addEmailQuestion,
  makeEmailQuestionsSpam,
  answerEmailQuestion,
  deleteEmailQuestions,
} = require('./email-chat.helper');
const {
  EMAIL_MESSAGES_STATUSES: { SPAM, ANSWERED },
} = require('../../consts/email-statuses');
const {
  QUESTION_NOT_FOUND,
} = require('../../error-messages/email-chat.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

let operations;
let question;
let adminId;
let senderName;
let text;
let email;
let language;

describe('Chat email mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const {
      data: {
        loginAdmin: { _id },
      },
    } = await loginAdmin(
      superAdminUser.email,
      superAdminUser.password,
      operations
    );
    adminId = _id;
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
  });

  test('should create email question', () => {
    expect(question).toBeDefined();
    expect(question).toHaveProperty('senderName', senderName);
    expect(question).toHaveProperty('text', text);
    expect(question).toHaveProperty('email', email);
    expect(question).toHaveProperty('language', language);
  });

  test('should update email questions to spam', async () => {
    const result = await makeEmailQuestionsSpam(
      [question._id],
      adminId,
      operations
    );

    expect(result).toBeDefined();
    expect(result[0]).toHaveProperty('senderName', senderName);
    expect(result[0]).toHaveProperty('status', SPAM);
    expect(result[0]).toHaveProperty('answer.text', '');
  });

  test('should create answer to email question', async () => {
    const result = await answerEmailQuestion(
      question._id,
      adminId,
      fakeAnswer,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('senderName', senderName);
    expect(result).toHaveProperty('status', ANSWERED);
    expect(result).toHaveProperty('answer.text', fakeAnswer);
  });

  test('should throw "QUESTION_NOT_FOUND" err msg if question id is not exists', async () => {
    const result = await answerEmailQuestion(
      fakeQuestionId,
      adminId,
      fakeAnswer,
      operations
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('message', QUESTION_NOT_FOUND);
    expect(result).toHaveProperty('statusCode', NOT_FOUND);
  });

  test('should delete email questions', async () => {
    const result = await deleteEmailQuestions([question._id], operations);

    expect(result).toBeDefined();
    expect(result[0]).toHaveProperty('senderName', senderName);
    expect(result[0]).toHaveProperty('text', text);
    expect(result[0]).toHaveProperty('status', ANSWERED);
  });
});
