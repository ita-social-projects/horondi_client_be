const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const businessTextMutation = {
  addBusinessText: hasRoles([SUPERADMIN, ADMIN]),
  deleteBusinessText: hasRoles([SUPERADMIN, ADMIN]),
  updateBusinessText: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { businessTextMutation };
