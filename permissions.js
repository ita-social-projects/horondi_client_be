const { shield } = require('graphql-shield');
const {
  userPermissionsMutations,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  },
);

module.exports = permissions;
