const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;

const materialPermissionsQuery = {
  getAllMaterials: allow,
  getMaterialById: allow,
};

const materialPermissionsMutations = {
  addMaterial: hasRoles([ADMIN, SUPERADMIN]),
  deleteMaterial: hasRoles([ADMIN, SUPERADMIN]),
  updateMaterial: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { materialPermissionsMutations, materialPermissionsQuery };
