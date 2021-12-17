const { allow, and } = require('graphql-shield');
const { hasRoles, inputDataValidation } = require('../../utils/rules');
const { roles } = require('../../consts');
const {
  positionInputValidator,
} = require('../../validators/position.validator');
const {
  INPUT_FIELDS: { POSITION },
} = require('../../consts/input-fields');

const { ADMIN, SUPERADMIN } = roles;
const positionPermissionsQuery = {
  getAllPositions: allow,
  getPositionById: allow,
};
const positionPermissionsMutations = {
  addPosition: and(
    inputDataValidation(POSITION, positionInputValidator),
    hasRoles([ADMIN, SUPERADMIN]),
  ),
  updatePosition: and(
    inputDataValidation(POSITION, positionInputValidator),
    hasRoles([ADMIN, SUPERADMIN]),
  ),
  deletePosition: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  positionPermissionsQuery,
  positionPermissionsMutations,
};
