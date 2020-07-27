const { newsQuery, newsMutation } = require('./modules/news/news.resolver');
const { userQuery, userMutation } = require('./modules/user/user.resolver');
const {
  productsQuery,
  productsMutation,
} = require('./modules/product/product.resolver');

const {
  commentsQuery,
  commentsMutation,
} = require('./modules/comment/comment.resolver');

const {
  currencyQuery,
  currencyMutation,
} = require('./modules/currency/currency.resolver');
const {
  materialQuery,
  materialMutation,
} = require('./modules/material/material.resolver');
const {
  patternQuery,
  patternMutation,
} = require('./modules/pattern/pattern.resolver');
const {
  categoryQuery,
  categoryMutation,
} = require('./modules/category/category.resolver');
const categoryService = require('./modules/category/category.service');
const userService = require('./modules/user/user.service');
const productsService = require('./modules/product/product.service');
const materialsService = require('./modules/material/material.service');
const commentsService = require('./modules/comment/comment.service');

const resolvers = {
  Query: {
    ...currencyQuery,

    ...materialQuery,

    ...patternQuery,

    ...categoryQuery,

    ...newsQuery,

    ...userQuery,

    ...productsQuery,

    ...commentsQuery,
  },
  Comments: {
    user: parent => userService.getUserByFieldOrThrow('_id', parent.user),
    product: parent => productsService.getProductsById(parent.product),
  },

  Products: {
    subcategory: parent => categoryService.getCategoryById(parent.subcategory),
    comments: parent => commentsService.getAllCommentsByProduct(parent._id),
  },

  ProductOptions: {
    size: parent => productsService.getSizeById(parent.size),
    bottomMaterial: parent => materialsService.getMaterialById(parent.bottomMaterial),
  },

  Mutation: {
    ...patternMutation,

    ...materialMutation,

    ...categoryMutation,

    ...currencyMutation,

    ...newsMutation,

    ...userMutation,

    ...productsMutation,

    ...commentsMutation,
  },
};

module.exports = resolvers;
