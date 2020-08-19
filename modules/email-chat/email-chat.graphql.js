const emailChatType = `
type EmailChat {
  _id: ID!
  senderName: String
  text: String
  date: String
  email: String
  status: String!
  answer: EmailAnswer
}
`;

const emailChatInput = `
input EmailChatInput {
  senderName: String
  text: String
  email: String
  status: String
  answer: EmailAnswerInput
}`;

module.exports = {
  emailChatType,
  emailChatInput,
};
