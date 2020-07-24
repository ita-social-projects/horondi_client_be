const { newsQuery, newsMutation } = require('./modules/news/news.resolver');
const { userQuery, userMutation } = require('./modules/user/user.resolver');
const {
  productsQuery,
  productsMutation,
} = require('./modules/products/products.resolver');
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
const { getCategoryById } = require('./modules/category/category.service');
// const { getUserByFieldOrThrow } = require('./modules/user/user.service');

const resolvers = {
  Query: {
    ...currencyQuery,

    ...materialQuery,

    ...patternQuery,

    ...categoryQuery,

    ...newsQuery,

    ...userQuery,

    ...productsQuery,
  },

  Products: {
    subcategory: parent => getCategoryById(parent.subcategory),
    // comments: parent => {
    //   console.log(parent.comments);
    //   return parent.comments;
    // },
    // votedUsers: parent => {
    //   getUserByFieldOrThrow('id', parent.votedUsers);
    // },
  },

  Mutation: {
    ...patternMutation,

    ...materialMutation,

    ...categoryMutation,

    ...currencyMutation,

    ...newsMutation,

    ...userMutation,

    ...productsMutation,
  },
};

module.exports = resolvers;
