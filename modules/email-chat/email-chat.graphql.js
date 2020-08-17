const emailChatType = `
type EmailChat {
  _id: ID!
  text: String!
  date: String!
  email: String!
  status: String!
}
`;

const emailChatInput = `
input EmailChatInput {
  text: String!
  email: String!
  status: String!
}`;

module.exports = {
  emailChatType,
  emailChatInput,
};
