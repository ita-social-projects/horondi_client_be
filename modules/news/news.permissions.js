const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { ADMIN, SUPERADMIN } = roles;
const { checkImageType, checkImageSize } = require('../../utils/rules');

const newsPermissionsQuery = {
  getAllNews: allow,
  getNewsById: allow,
};

const newsPermissionsMutations = {
  addNews: and(hasRoles([ADMIN, SUPERADMIN]), checkImageType, checkImageSize),
  deleteNews: hasRoles([ADMIN, SUPERADMIN]),
  updateNews: and(
    hasRoles([ADMIN, SUPERADMIN]),
    checkImageType,
    checkImageSize
  ),
};

module.exports = { newsPermissionsQuery, newsPermissionsMutations };
