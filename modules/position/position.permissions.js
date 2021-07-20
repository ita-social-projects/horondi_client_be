const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;
const positionPermissionsQuery = {
  getAllPositions: allow,
  getPositionById: allow,
};
const positionPermissionsMutations = {
  addPosition: hasRoles([ADMIN, SUPERADMIN]),
  deletePosition: hasRoles([ADMIN, SUPERADMIN]),
  updatePosition: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  positionPermissionsQuery,
  positionPermissionsMutations,
};
