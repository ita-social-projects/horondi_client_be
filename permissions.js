const { shield } = require('graphql-shield');
const {
  userPermissionsMutations,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');
const {
  patternPermissionsMutations,
  patternPermissionsQuery,
} = require('./modules/pattern/pattern.permisions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...patternPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutations,
      ...patternPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  },
);

module.exports = permissions;
