const { newsQuery, newsMutation } = require('./modules/news/news.resolver');

const {
  currencyQuery,
  currencyMutation,
} = require('./modules/currencies/currencies.resolver');
const {
  materialQuery,
  materialMutation,
} = require('./modules/materials/materials.resolver');
const {
  patternQuery,
  patternMutation,
} = require('./modules/patterns/patterns.resolver');
const {
  categoryQuery,
  categoryMutation,
} = require('./modules/categories/categories.resolver');

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
