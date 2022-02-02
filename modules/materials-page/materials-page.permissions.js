const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const materialsPermissionsMutation = {
  addMaterialsBlock: hasRoles([ADMIN, SUPERADMIN]),
  deleteMaterialsBlock: hasRoles([ADMIN, SUPERADMIN]),
  updateMaterialsBlock: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { materialsPermissionsMutation };
