const { shield } = require('graphql-shield');
const {
  userPermissionsMutation,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutation,
    }
  },
  {
    allowExternalErrors: true,
  },
);

module.exports = permissions;
