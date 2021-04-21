const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const homePageSlideMutation = {
  addSlide: hasRoles([SUPERADMIN, ADMIN]),
  updateSlide: hasRoles([SUPERADMIN, ADMIN]),
  deleteSlide: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { homePageSlideMutation };
