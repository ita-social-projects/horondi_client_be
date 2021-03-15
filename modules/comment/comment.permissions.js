const { allow } = require('graphql-shield');

const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const commentPermissionsQuery = {
  getCommentById: allow,
  getAllCommentsByProduct: allow,
  getAllCommentsByUser: allow,
  getRecentComments: hasRoles([ADMIN, SUPERADMIN]),
};
const commentPermissionsMutations = {
  updateComment: hasRoles([ADMIN, SUPERADMIN]),
  addComment: hasRoles([ADMIN, SUPERADMIN]),
  deleteComment: hasRoles([ADMIN, SUPERADMIN]),
  addRate: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { commentPermissionsMutations, commentPermissionsQuery };
