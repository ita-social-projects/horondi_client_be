const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;

const newsPermissionsQuery = {
  getAllNews: allow,
  getNewsById: allow,
};

const newsPermissionsMutations = {
  addNews: hasRoles([ADMIN, SUPERADMIN]),
  deleteNews: hasRoles([ADMIN, SUPERADMIN]),
  updateNews: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { newsPermissionsQuery, newsPermissionsMutations };
