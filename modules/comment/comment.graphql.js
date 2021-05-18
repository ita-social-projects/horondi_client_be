const commentType = `
type Comment {
_id: ID!
text: String!
date: String!
user: User
product: Product
show: Boolean
replyComments:[ReplyComments]
}

type ReplyComments{
  replyText:String
  answerer: User
  refToReplyComment: ID
  createdAt: Date
  updatedAt: Date
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
  input ReplyCommentInput {
    refToReplyComment: ID
    replyText: String!
    answerer: ID!
  }
`;

module.exports = {
  commentType,
  commentInput,
};
