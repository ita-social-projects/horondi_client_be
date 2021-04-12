const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;

const homePageImagesPermissionsQuery = {
  getHomePageLooksImages: allow,
};
const homePageImagesPermissionsMutations = {
  updateHomePageLooksImage: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  homePageImagesPermissionsMutations,
  homePageImagesPermissionsQuery,
};
