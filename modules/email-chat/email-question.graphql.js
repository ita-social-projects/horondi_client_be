const emailQuestionType = `
type EmailQuestion {
  _id: ID
  senderName: String!
  text: String!
  date: String!
  email: String!  
  status: String!
  language: Int!
  answer: EmailAnswer
}
`;

const emailQuestionInput = `
input EmailQuestionInput {
  senderName: String!
  text: String!
  email: String!
  language: Int!
}`;

module.exports = {
  emailQuestionType,
  emailQuestionInput,
};
