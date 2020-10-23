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
  contactPermissionsQuery,
  contactPermissionsMutations,
} = require('./modules/contact/contact.permission');

const {
  newsPermissionsQuery,
  newsPermissionsMutations,
} = require('./modules/news/news.permissions');

const {
  headerPermissionsMutations,
  headerPermissionsQuery,
} = require('./modules/header/header.permisions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...patternPermissionsQuery,
      ...materialPermissionsQuery,
      ...contactPermissionsQuery,
      ...newsPermissionsQuery,
      ...headerPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutation,
      ...patternPermissionsMutations,
      ...materialPermissionsMutations,
      ...contactPermissionsMutations,
      ...newsPermissionsMutations,
      ...headerPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
