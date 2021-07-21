const { allow, or, and } = require('graphql-shield');

const {
  hasRoles,
  isTheSameUser,
  isAuthorized,
  inputDataValidation,
} = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN, USER },
} = require('../../consts');
const {
  replyCommentValidator,
  commentValidator,
  commentUpdateValidator,
  replyCommentUpdateValidator,
} = require('../../validators/comment.validator');
const {
  INPUT_FIELDS: { REPLY_COMMENT_DATA, COMMENT },
} = require('../../consts/input-fields');

const commentPermissionsQuery = {
  getCommentById: allow,
  getCommentsByProduct: allow,
  getAllCommentsByUser: allow,
  getReplyCommentsByComment: allow,
  getRecentComments: hasRoles([ADMIN, SUPERADMIN]),
  getReplyCommentById: hasRoles([ADMIN, SUPERADMIN]),
};

const commentPermissionsMutations = {
  updateComment: and(
    inputDataValidation(COMMENT, commentUpdateValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  addComment: and(
    inputDataValidation(COMMENT, commentValidator),
    isTheSameUser
  ),
  replyForComment: and(
    inputDataValidation(REPLY_COMMENT_DATA, replyCommentValidator),
    isTheSameUser
  ),
  updateReplyForComment: and(
    inputDataValidation(REPLY_COMMENT_DATA, replyCommentUpdateValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteComment: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  deleteReplyForComment: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  addRate: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN, USER])),
};

module.exports = { commentPermissionsMutations, commentPermissionsQuery };
