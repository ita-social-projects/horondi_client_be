const commentType = `
type Comment {
_id: ID!
text: String!
date: String!
user: UserForComment
product: Product
show: Boolean
}
`;

const commentInput = `
input commentInput {
  text: String
  user: UserForCommentInput
  product: ID!
  show: Boolean!
}`;

module.exports = {
  commentType,
  commentInput,
};
