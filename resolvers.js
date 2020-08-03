const { newsQuery, newsMutation } = require('./modules/news/news.resolver');
const { userQuery, userMutation } = require('./modules/user/user.resolver');
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

const SCHEMA_NAMES = {
  category: 'Category',
  news: 'News',
  pattern: 'Pattern',
  material: 'Material',
  currency: 'Currency',
};
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
  CategoryResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.category;
      }
      return 'Error';
    },
  },
  CurrencyResult: {
    __resolveType: obj => {
      if (obj.date) {
        return SCHEMA_NAMES.currency;
      }
      return 'Error';
    },
  },
  NewsResult: {
    __resolveType: obj => {
      if (obj.title) {
        return SCHEMA_NAMES.news;
      }
      return 'Error';
    },
  },
  MaterialResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.material;
      }
      return 'Error';
    },
  },
  PatternResult: {
    __resolveType: obj => {
      if (obj.name) {
        return SCHEMA_NAMES.pattern;
      }
      return 'Error';
    },
  },
};

module.exports = resolvers;
