const { and } = require('graphql-shield');
const { hasRoles, inputDataValidation } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');
const {
  INPUT_FIELDS: { HOME_PAGE_SLIDE },
} = require('../../consts/input-fields');
const {
  homepageSliderValidator,
} = require('../../validators/homepage-slider.validator');

const homePageSlideMutation = {
  addSlide: and(
    inputDataValidation(HOME_PAGE_SLIDE, homepageSliderValidator),
    hasRoles([SUPERADMIN, ADMIN]),
  ),
  updateSlide: and(
    inputDataValidation(HOME_PAGE_SLIDE, homepageSliderValidator),
    hasRoles([SUPERADMIN, ADMIN]),
  ),
  deleteSlide: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { homePageSlideMutation };
