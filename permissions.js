const { shield } = require('graphql-shield');
const {
  userPermissionsMutations,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');
const {
  materialPermissionsQuery,
  materialPermissionsMutations,
} = require('./modules/material/material.permissions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...materialPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutations,
      ...materialPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  },
);

module.exports = permissions;
