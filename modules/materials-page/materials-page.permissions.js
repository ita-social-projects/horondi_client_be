const { allow } = require('graphql-shield');

const materialsPermissionsQuery = {
  getAllMaterialsBlocks: allow,
};

const materialsPermissionsMutation = {
  addMaterialsBlock: allow,
  deleteMaterialsBlock: allow,
  updateMaterialsBlock: allow,
};

module.exports = { materialsPermissionsQuery, materialsPermissionsMutation };
