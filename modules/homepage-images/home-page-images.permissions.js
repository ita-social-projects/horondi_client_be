const { allow, and } = require('graphql-shield');
const { hasRoles, inputDataValidation } = require('../../utils/rules');
const { roles } = require('../../consts');
const {
  INPUT_FIELDS: { HOME_PAGE_IMAGE },
} = require('../../consts/input-fields');
const { ADMIN, SUPERADMIN } = roles;
const {
  homePageImagesValidator,
} = require('../../validators/homepage-slider.validator');

const homePageImagesPermissionsQuery = {
  getHomePageLooksImages: allow,
};
const homePageImagesPermissionsMutations = {
  updateHomePageLooksImage: and(
    inputDataValidation(HOME_PAGE_IMAGE, homePageImagesValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = {
  homePageImagesPermissionsMutations,
  homePageImagesPermissionsQuery,
};
