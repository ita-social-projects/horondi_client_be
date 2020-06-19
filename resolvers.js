const Currency = require('./modules/currencies/currencies.resolver');
const Material = require('./modules/materials/materials.resolver');
const Pattern = require('./modules/patterns/patterns.resolver');
const Category = require('./modules/categories/categories.resolver');

const resolvers = {
  Query: {
    ...Currency,

    ...Category,

    ...Material,

    ...Pattern,
  },
};

module.exports = resolvers;
