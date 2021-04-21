const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const uploadMutation = {
  uploadFiles: hasRoles([SUPERADMIN, ADMIN]),
  deleteFiles: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { uploadMutation };
