const { allow } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;

const patternPermissionsMutations = {
  addPattern: hasRoles([ADMIN, SUPERADMIN]),
};
