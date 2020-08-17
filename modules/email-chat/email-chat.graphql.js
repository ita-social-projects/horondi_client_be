const emailChatType = `
type EmailChat {
  _id: ID!
  name: String
  text: String!
  date: String!
  email: String!
  status: String!
}
`;

const emailChatInput = `
input EmailChatInput {
  name: String
  text: String!
  email: String!
  status: String
}`;

module.exports = {
  emailChatType,
  emailChatInput,
};
