const commentType = `
type Comment {
_id: ID!
text: String!
date: Date!
updatedAt: Date!
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
  user: ID
  userName: String
  email: String
  product: ID!
}
input CommentUpdateInput {
  ${sharedInputFields}
}
input ReplyCommentUpdateInput {
  replyText: String
  showReplyComment: Boolean
}
input CommentFilterInput{
    date:DateRangeInput
    show:[String]
    search:String
  }
  input ReplyCommentInput {
    answererEmail: String
    answererName: String
    refToReplyComment: ID
    replyText: String!
    answerer: ID
  }
`;

module.exports = {
  commentType,
  commentInput,
};
