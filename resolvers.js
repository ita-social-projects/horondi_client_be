const {
  CurrencyQuery,
  CurrencyMutation,
} = require('./modules/currencies/currencies.resolver');
const {
  MaterialQuery,
  MaterialMutation,
} = require('./modules/materials/materials.resolver');
const {
  PatternQuery,
  PatternMutation,
} = require('./modules/patterns/patterns.resolver');
const {
  CategoryQuery,
  CategoryMutation,
} = require('./modules/categories/categories.resolver');

const resolvers = {
  Query: {
    ...CurrencyQuery,

    ...MaterialQuery,

    ...PatternQuery,

    ...CategoryQuery,
  },
  Mutation: {
    ...PatternMutation,

    ...MaterialMutation,

    ...CategoryMutation,

    ...CurrencyMutation,
  },
};

module.exports = resolvers;
