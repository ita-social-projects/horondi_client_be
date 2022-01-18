const { shield } = require('graphql-shield');

const {
  emailChatQuestionQuery,
} = require('./modules/email-chat/email-chat.permission');

const {
  questionsAnswersMutation,
} = require('./modules/questions-answers/questions-answers.permissions');

const { uploadMutation } = require('./modules/upload/upload.permission');

const {
  promoCodeMutation,
} = require('./modules/promo-code/promo-code.permissions');

const {
  homePageSlideMutation,
} = require('./modules/homepage-slider/homepage-slider.permission');

const { currencyMutation } = require('./modules/currency/currency.permission');

const {
  certificatePermissionsMutations,
  certificatePermissionsQuery,
} = require('./modules/certificate/certificates.permission');

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
  restrictionPermissionsMutations,
  restrictionPermissionsQuery,
} = require('./modules/restriction/restriction.permissions');

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
  pocketPermissionsMutations,
  pocketPermissionsQuery,
} = require('./modules/pocket/pocket.permissions');

const {
  backPermissionsMutations,
  backPermissionsQuery,
} = require('./modules/back/back.permissions');

const {
  bottomPermissionsMutations,
  bottomPermissionsQuery,
} = require('./modules/bottom/bottom.permissions');

const {
  strapPermissionsQuery,
  strapPermissionsMutations,
} = require('./modules/strap/strap.permissions');

const {
  orderPermissionsMutation,
  orderPermissionsQuery,
} = require('./modules/order/order.permissions');

const {
  productPermissionsMutation,
} = require('./modules/product/product.permissions');

const {
  positionPermissionsQuery,
  positionPermissionsMutations,
} = require('./modules/position/position.permissions');
const {
  basicsPermissionsQuery,
  basicsPermissionsMutations,
} = require('./modules/basics/basics.permissions');
const {
  constructorPermissionsQuery,
  constructorPermissionsMutations,
} = require('./modules/constructor_new/constructor.permissions');
const {
  wishlistPermissionsQuery,
  wishlistPermissionsMutations,
} = require('./modules/wishlist/wishlist.permissions');

const permissions = shield(
  {
    Query: {
      ...historyPermissionsQuery,
      ...cartPermissionsQuery,
      ...certificatePermissionsQuery,
      ...userPermissionsQuery,
      ...patternPermissionsQuery,
      ...materialPermissionsQuery,
      ...contactPermissionsQuery,
      ...newsPermissionsQuery,
      ...categoryPermissionsQuery,
      ...modelPermissionsQuery,
      ...restrictionPermissionsQuery,
      ...homePageImagesPermissionsQuery,
      ...closurePermissionsQuery,
      ...sizePermissionsQuery,
      ...colorPermissionsQuery,
      ...сonstructorBottomPermissionsQuery,
      ...constructorBasicPermissionsQuery,
      ...constructorFrontPocketPermissionsQuery,
      ...commentPermissionsQuery,
      ...pocketPermissionsQuery,
      ...backPermissionsQuery,
      ...bottomPermissionsQuery,
      ...orderPermissionsQuery,
      ...strapPermissionsQuery,
      ...emailChatQuestionQuery,
      ...positionPermissionsQuery,
      ...basicsPermissionsQuery,
      ...constructorPermissionsQuery,
      ...wishlistPermissionsQuery,
    },
    Mutation: {
      ...questionsAnswersMutation,
      ...productPermissionsMutation,
      ...promoCodeMutation,
      ...cartPermissionsMutations,
      ...userPermissionsMutation,
      ...patternPermissionsMutations,
      ...materialPermissionsMutations,
      ...contactPermissionsMutations,
      ...newsPermissionsMutations,
      ...categoryPermissionsMutations,
      ...modelPermissionsMutations,
      ...restrictionPermissionsMutations,
      ...homePageImagesPermissionsMutations,
      ...closurePermissionsMutations,
      ...sizePermissionsMutations,
      ...colorPermissionsMutations,
      ...сonstructorBottomPermissionsMutations,
      ...constructorBasicPermissionsMutations,
      ...constructorFrontPocketPermissionsMutations,
      ...commentPermissionsMutations,
      ...pocketPermissionsMutations,
      ...backPermissionsMutations,
      ...bottomPermissionsMutations,
      ...orderPermissionsMutation,
      ...strapPermissionsMutations,
      ...businessTextMutation,
      ...emailChatQuestionMutation,
      ...currencyMutation,
      ...certificatePermissionsMutations,
      ...homePageSlideMutation,
      ...uploadMutation,
      ...positionPermissionsMutations,
      ...basicsPermissionsMutations,
      ...constructorPermissionsMutations,
      ...wishlistPermissionsMutations,
    },
  },
  {
    allowExternalErrors: true,
  }
);

module.exports = permissions;
