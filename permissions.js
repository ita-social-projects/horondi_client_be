const { shield } = require('graphql-shield');
const {
  userPermissionsMutations,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');

const {
  contactPermissionsQuery,
  contactPermissionsMutations,
} = require('./modules/contact/contact.permission');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...contactPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutations,
      ...contactPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
