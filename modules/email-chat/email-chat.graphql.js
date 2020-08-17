const emailChatType = `
type EmailChat {
  _id: ID!
  senderName: String
  text: String!
  date: String!
  email: String!
  status: String!
}
`;

const emailChatInput = `
input EmailChatInput {
  senderName: String
  text: String!
  email: String!
  status: String
}`;

module.exports = {
  emailChatType,
  emailChatInput,
};
