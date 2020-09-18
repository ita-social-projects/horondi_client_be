const { allow } = require('graphql-shield');
const { isAuthorizedAdmin } = require('../../utils/rules');

const materialPermissionsQuery = {
  getAllMaterials: allow,
  getMaterialById: allow,
};

const materialPermissionsMutations = {
  addMaterial: isAuthorizedAdmin,
  deleteMaterial: isAuthorizedAdmin,
  updateMaterial: isAuthorizedAdmin,
};

module.exports = { materialPermissionsMutations, materialPermissionsQuery };
