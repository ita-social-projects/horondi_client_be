const { allow } = require('graphql-shield');
const { hasRoles } = require('../../../utils/rules');
const { roles } = require('../../../consts');
const { ADMIN, SUPERADMIN } = roles;

const сonstructorBottomPermissionsQuery = {
  getAllConstructorBottom: allow,
  getConstructorBottomById: allow,
};

const сonstructorBottomPermissionsMutations = {
  addConstructorBottom: hasRoles([ADMIN, SUPERADMIN]),
  updateConstructorBottom: hasRoles([ADMIN, SUPERADMIN]),
  deleteConstructorBottom: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  сonstructorBottomPermissionsQuery,
  сonstructorBottomPermissionsMutations,
};
