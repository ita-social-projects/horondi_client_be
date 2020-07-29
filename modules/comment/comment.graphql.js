const commentType = `
type Comment {
_id: ID!
text: String!
date: String!
user: User!
product: Product
show: Boolean
}
`;

const commentInput = `
input commentInput {
  text: String
  user: ID
  product: ID!
  show: Boolean!
}`;

module.exports = {
  commentType,
  commentInput,
};
