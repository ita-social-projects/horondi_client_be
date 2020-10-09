const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN } = roles;

const newsPermissionsQuery = {
  getAllNews: allow,
  getNewsById: allow,
};

const newsPermissionsMutations = {
  addNews: hasRoles([ADMIN]),
  deleteNews: hasRoles([ADMIN]),
  updateNews: hasRoles([ADMIN]),
};

module.exports = { newsPermissionsQuery, newsPermissionsMutations };
