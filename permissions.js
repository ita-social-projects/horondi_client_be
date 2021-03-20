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
  closurePermissionsMutations,
  closurePermissionsQuery,
} = require('./modules/closures/closures.permission');

const {
  sizePermissionsMutations,
  sizePermissionsQuery,
} = require('./modules/size/size.permissions');

const {
  colorPermissionsMutations,
  colorPermissionsQuery,
} = require('./modules/color/color.permissions');

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

const {
  commentPermissionsMutations,
  commentPermissionsQuery,
} = require('./modules/comment/comment.permissions');

const {
  pocketPermissionsMutations,
  pocketPermissionsQuery,
} = require('./modules/pocket/pocket.permissions');

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
      ...closurePermissionsQuery,
      ...sizePermissionsQuery,
      ...colorPermissionsQuery,
      ...сonstructorBottomPermissionsQuery,
      ...constructorBasicPermissionsQuery,
      ...constructorFrontPocketPermissionsQuery,
      ...commentPermissionsQuery,
      ...pocketPermissionsQuery,
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
      ...closurePermissionsMutations,
      ...sizePermissionsMutations,
      ...colorPermissionsMutations,
      ...сonstructorBottomPermissionsMutations,
      ...constructorBasicPermissionsMutations,
      ...constructorFrontPocketPermissionsMutations,
      ...commentPermissionsMutations,
      ...pocketPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
