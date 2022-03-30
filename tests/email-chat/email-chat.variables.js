const {
  EMAIL_MESSAGES_STATUSES: { SPAM, ANSWERED, PENDING },
} = require('../../consts/email-statuses');

const fakeSenderName = 'Oliver';
const fakeQuestionId = '5fb412d8663cf10bec9faa1a';
const fakeAnswer = `New fake admin answer to ${fakeSenderName}`;

const getFilterPaginationInputData = dateFrom => ({
  filter: {
    search: fakeSenderName,
    emailQuestionStatus: [SPAM, ANSWERED, PENDING],
    date: {
      dateFrom,
      dateTo: new Date(),
    },
  },
  pagination: {
    skip: 0,
    limit: 10,
  },
});

const emailQuestionInputData = {
  senderName: fakeSenderName,
  text: `Another fake question from ${fakeSenderName}`,
  email: 'some@gmail.com',
  language: 1,
};

module.exports = {
  getFilterPaginationInputData,
  emailQuestionInputData,
  fakeAnswer,
  fakeQuestionId,
};
