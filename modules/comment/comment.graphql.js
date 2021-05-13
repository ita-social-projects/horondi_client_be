const commentType = `
type Comment {
_id: ID!
text: String!
date: String!
user: User
product: Product
show: Boolean
}
`;

const sharedInputFields = `
  text: String
  show: Boolean
`;
const commentInput = `
input CommentInput {
  ${sharedInputFields}
  user: ID!
  product: ID!
}
input CommentUpdateInput {
  ${sharedInputFields}
}
input CommentFilterInput{
    date:DateRangeInput
    show:[String]
    search:String
  }
`;

module.exports = {
  commentType,
  commentInput,
};
