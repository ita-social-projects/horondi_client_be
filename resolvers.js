const { newsQuery, newsMutation } = require('./modules/news/news.resolver');

const {
  currencyQuery,
  currencyMutation,
} = require('./modules/currencies/currency.resolver');
const {
  materialQuery,
  materialMutation,
} = require('./modules/materials/material.resolver');
const {
  patternQuery,
  patternMutation,
} = require('./modules/patterns/pattern.resolver');
const {
  categoryQuery,
  categoryMutation,
} = require('./modules/categories/category.resolver');

const resolvers = {
  Query: {
    ...currencyQuery,

    ...materialQuery,

    ...patternQuery,

    ...categoryQuery,

    ...newsQuery,
  },
  Mutation: {
    ...patternMutation,

    ...materialMutation,

    ...categoryMutation,

    ...currencyMutation,

    ...newsMutation,
  },
};

module.exports = resolvers;
