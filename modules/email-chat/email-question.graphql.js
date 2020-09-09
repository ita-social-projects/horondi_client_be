const emailQuestionType = `
type EmailQuestion {
  _id: ID
  senderName: String!
  text: String!
  date: String!
  email: String!
  status: String!
  answear: EmailAnswear
}
`;

const emailQuestionInput = `
input EmailQuestionInput {
  senderName: String!
  text: String!
  email: String!
}`;

module.exports = {
  emailQuestionType,
  emailQuestionInput,
};
