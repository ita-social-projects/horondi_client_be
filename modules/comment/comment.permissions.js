const { allow, or } = require('graphql-shield');

const { hasRoles, isTheSameUser, isAuthorized } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN, USER },
} = require('../../consts');

const commentPermissionsQuery = {
  getCommentById: allow,
  getAllCommentsByProduct: allow,
  getAllCommentsByUser: allow,
  getRecentComments: hasRoles([ADMIN, SUPERADMIN]),
};

const commentPermissionsMutations = {
  updateComment: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN, USER])),
  addComment: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN, USER])),
  deleteComment: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN, USER])),
  addRate: or(isAuthorized, hasRoles([ADMIN, SUPERADMIN, USER])),
};

module.exports = { commentPermissionsMutations, commentPermissionsQuery };
