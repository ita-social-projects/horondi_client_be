const { newsQuery, newsMutation } = require('./src/modules/news/news.resolver');
const { userQuery, userMutation } = require('./src/modules/user/user.resolver');
const {
  currencyQuery,
  currencyMutation,
} = require('./src/modules/currency/currency.resolver');
const {
  materialQuery,
  materialMutation,
} = require('./src/modules/material/material.resolver');
const {
  patternQuery,
  patternMutation,
} = require('./src/modules/pattern/pattern.resolver');
const {
  categoryQuery,
  categoryMutation,
} = require('./src/modules/category/category.resolver');

const resolvers = {
  Query: {
    ...currencyQuery,

    ...materialQuery,

    ...patternQuery,

    ...categoryQuery,

    ...newsQuery,

    ...userQuery,
  },
  Mutation: {
    ...patternMutation,

    ...materialMutation,

    ...categoryMutation,

    ...currencyMutation,

    ...newsMutation,

    ...userMutation,
  },
};

module.exports = resolvers;
