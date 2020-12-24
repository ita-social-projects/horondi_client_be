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
  categoryPermissionsMutations,
  categoryPermissionsQuery,
} = require('./modules/category/category.permission');

const {
  modelPermissionsMutations,
  modelPermissionsQuery,
} = require('./modules/model/model.permission');

const {
  headerPermissionsMutations,
  headerPermissionsQuery,
} = require('./modules/header/header.permisions');

const {
  homePageImagesPermissionsMutations,
  homePageImagesPermissionsQuery,
} = require('./modules/homepage-images/home-page-images.permissions');

const {
  constructorBasicPermissionsQuery,
  constructorBasicPermissionsMutations,
} = require('./modules/constructor/constructor-basic/constructor-basic.permission');

const {
  constructorFrontPocketPermissionsQuery,
  constructorFrontPocketPermissionsMutations,
} = require('./modules/constructor/constructor-front-pocket/constructor-front-pocket.permission');


const {
  сonstructorBottomPermissionsQuery,
  сonstructorBottomPermissionsMutations,
} = require('./modules/constructor/constructor-bottom/constructor-bottom.permissions');

const permissions = shield(
  {
    Query: {
      ...userPermissionsQuery,
      ...patternPermissionsQuery,
      ...materialPermissionsQuery,
      ...contactPermissionsQuery,
      ...newsPermissionsQuery,
      ...categoryPermissionsQuery,
      ...modelPermissionsQuery,
      ...headerPermissionsQuery,
      ...homePageImagesPermissionsQuery,
      ...сonstructorBottomPermissionsQuery,
      ...constructorBasicPermissionsQuery,
      ...constructorFrontPocketPermissionsQuery,
    },
    Mutation: {
      ...userPermissionsMutation,
      ...patternPermissionsMutations,
      ...materialPermissionsMutations,
      ...contactPermissionsMutations,
      ...newsPermissionsMutations,
      ...categoryPermissionsMutations,
      ...modelPermissionsMutations,
      ...headerPermissionsMutations,
      ...homePageImagesPermissionsMutations,
      ...сonstructorBottomPermissionsMutations,
      ...constructorBasicPermissionsMutations,
      ...constructorFrontPocketPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
