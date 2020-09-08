const { shield } = require('graphql-shield');
const {
  userPermissionsMutations,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');

const {
  newsPermissionsQuery,
  newsPermissionsMutations
} = require('./modules/news/news.permissions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...newsPermissionsQuery
    },
    Mutation: {
      ...userPermissionsMutations,
      ...newsPermissionsMutations
    },
  },
  {
    allowExternalErrors: true,
  },
);

module.exports = permissions;
