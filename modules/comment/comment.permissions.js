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
} = require('../../validators/comment.validator');
const {
  INPUT_FIELDS: { REPLY_COMMENT_DATA, COMMENT },
} = require('../../consts/input-fields');

const commentPermissionsQuery = {
  getCommentById: allow,
  getAllCommentsByProduct: allow,
  getAllCommentsByUser: allow,
  getRecentComments: hasRoles([ADMIN, SUPERADMIN]),
};

const commentPermissionsMutations = {
  updateComment: hasRoles([ADMIN, SUPERADMIN]),
  addComment: and(isAuthorized, inputDataValidation(COMMENT, commentValidator)),
  replyForComment: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  updateReplyForComment: and(
    inputDataValidation(REPLY_COMMENT_DATA, replyCommentValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteComment: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  deleteReplyForComment: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
  addRate: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN, USER])),
};

module.exports = { commentPermissionsMutations, commentPermissionsQuery };
