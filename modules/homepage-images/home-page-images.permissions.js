const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');
const { checkImageType, checkImageSize } = require('../../utils/rules');

const { ADMIN, SUPERADMIN } = roles;

const homePageImagesPermissionsQuery = {
  getHomePageLooksImages: allow,
};
const homePageImagesPermissionsMutations = {
  updateHomePageLooksImage: and(
    hasRoles([ADMIN, SUPERADMIN]),
    checkImageType,
    checkImageSize
  ),
};

module.exports = {
  homePageImagesPermissionsMutations,
  homePageImagesPermissionsQuery,
};
