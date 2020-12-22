const { allow } = require('graphql-shield');
const { hasRoles } = require('../../../utils/rules');
const { roles } = require('../../../consts');
const { ADMIN, SUPERADMIN } = roles;

const constructorBasicPermissionsQuery = {
  getAllBasics: allow,
  getBasicById: allow,
};

const constructorBasicPermissionsMutations = {
  addBasic: hasRoles([ADMIN, SUPERADMIN]),
  updateBasic: hasRoles([ADMIN, SUPERADMIN]),
  deleteBasic: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = { constructorBasicPermissionsQuery, constructorBasicPermissionsMutations };
