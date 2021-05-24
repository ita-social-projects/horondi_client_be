const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const {
  materialInputValidator,
} = require('../../validators/material.validator');
const { inputDataValidation } = require('../../utils/rules');

const {
  DB_COLLECTIONS_NAMES: { MATERIAL },
} = require('../../consts/db-collections-names');

const materialPermissionsQuery = {
  getAllMaterials: hasRoles([ADMIN, SUPERADMIN]),
  getMaterialById: hasRoles([ADMIN, SUPERADMIN]),
};

const materialPermissionsMutations = {
  addMaterial: and(
    inputDataValidation(MATERIAL, materialInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteMaterial: hasRoles([ADMIN, SUPERADMIN]),
  updateMaterial: and(
    inputDataValidation(MATERIAL, materialInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = { materialPermissionsMutations, materialPermissionsQuery };
