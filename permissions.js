const { shield } = require('graphql-shield');
const {
  userPermissionsMutation,
  userPermissionsQuery,
} = require('./modules/user/user.permissions');
const {
  materialPermissionsQuery,
  materialPermissionsMutations,
} = require('./modules/material/material.permissions');

const {
  contactPermissionsQuery,
  contactPermissionsMutations,
} = require('./modules/contact/contact.permission');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...materialPermissionsQuery,
      ...contactPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutation,
      ...materialPermissionsMutations,
      ...contactPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
