const { shield } = require('graphql-shield');

const {
  emailChatQuestionQuery,
} = require('./modules/email-chat/email-chat.permission');

const { uploadMutation } = require('./modules/upload/upload.permission');

const {
  homePageSlideMutation,
} = require('./modules/homepage-slider/homepage-slider.permission');

const { currencyMutation } = require('./modules/currency/currency.permission');

const {
  emailChatQuestionMutation,
} = require('./modules/email-chat/email-chat.permission');

const {
  businessTextMutation,
} = require('./modules/business-text/business-text.permissions');

const {
  historyPermissionsQuery,
} = require('./modules/history/history.permissions');
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
  cartPermissionsMutations,
  cartPermissionsQuery,
} = require('./modules/cart/cart.permissions');

const {
  commentPermissionsMutations,
  commentPermissionsQuery,
} = require('./modules/comment/comment.permissions');

const {
  orderPermissionsMutation,
  orderPermissionsQuery,
} = require('./modules/order/order.permissions');

const {
  productPermissionsMutation,
} = require('./modules/product/product.permissions');

const permissions = shield(
  {
    Query: {
      ...historyPermissionsQuery,
      ...cartPermissionsQuery,
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
      ...orderPermissionsQuery,
      ...emailChatQuestionQuery,
    },
    Mutation: {
      ...productPermissionsMutation,
      ...cartPermissionsMutations,
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
      ...orderPermissionsMutation,
      ...businessTextMutation,
      ...emailChatQuestionMutation,
      ...currencyMutation,
      ...homePageSlideMutation,
      ...uploadMutation,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
