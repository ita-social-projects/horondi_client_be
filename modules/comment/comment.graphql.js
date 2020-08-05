const commentType = `
type Comment {
_id: ID!
text: String!
date: String!
user: User
email: String
product: Product
show: Boolean
}
`;

const commentInput = `
input commentInput {
  text: String
  product: ID!
  show: Boolean!
}`;

module.exports = {
  commentType,
  commentInput,
};
