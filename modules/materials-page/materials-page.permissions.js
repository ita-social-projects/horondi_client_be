const { allow } = require('graphql-shield');

const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const materialsPermissionsQuery = {
  getAllMaterialsBlocks: allow,
};

const materialsPermissionsMutation = {
  addMaterialsBlock: hasRoles([ADMIN, SUPERADMIN]),
  deleteMaterialsBlock: hasRoles([ADMIN, SUPERADMIN]),
  updateMaterialsBlock: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { materialsPermissionsQuery, materialsPermissionsMutation };
