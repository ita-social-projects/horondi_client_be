const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN } = roles;

const materialPermissionsQuery = {
  getAllMaterials: allow,
  getMaterialById: allow,
};

const materialPermissionsMutations = {
  addMaterial: hasRoles([ADMIN]),
  deleteMaterial: hasRoles([ADMIN]),
  updateMaterial: hasRoles([ADMIN]),
};

module.exports = { materialPermissionsMutations, materialPermissionsQuery };
