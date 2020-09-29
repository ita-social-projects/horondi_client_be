const { shield } = require('graphql-shield');
const {
  userPermissionsMutation,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');
const {
  patternPermissionsMutations,
  patternPermissionsQuery,
} = require('./modules/pattern/pattern.permisions');
const {
  materialPermissionsQuery,
  materialPermissionsMutations,
} = require('./modules/material/material.permissions');

const {
  newsPermissionsQuery,
  newsPermissionsMutations,
} = require('./modules/news/news.permissions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...patternPermissionsQuery,
      ...materialPermissionsQuery,
      ...newsPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutation,
      ...patternPermissionsMutations,
      ...materialPermissionsMutations,
      ...newsPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
