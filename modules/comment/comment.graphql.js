const commentsType = `
type Comments {
_id: ID!
text: String!
date: String!
user: User!
product: Products
show: Boolean
}
`;

const commentsInput = `
input commentsInput {
  text: String
  user: ID
  product: String!
  show: Boolean!
}`;

module.exports = {
  commentsType,
  commentsInput,
};
