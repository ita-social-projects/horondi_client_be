const commentType = `
type Comment {
_id: ID
text: String
date: Date
updatedAt: Date
user: User
product: Product
show: Boolean
replyComments:[ReplyComments]
replyCommentsCount:Int
rate: Int
isSelled: Boolean
}

type ReplyComments{
  _id: ID
  replyText: String
  answerer: User
  refToReplyComment: ID
  createdAt: Date
  updatedAt: Date
  showReplyComment: Boolean
  isSelled: Boolean
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
  product: ID!
  rate:Int
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
    refToReplyComment: ID
    replyText: String!
    answerer: ID
    productId: ID
  }
`;

module.exports = {
  commentType,
  commentInput,
};
