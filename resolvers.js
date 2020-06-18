const Currency = require('./models/Currency');
const Category = require('./models/Category');
const News = require('./models/News');

const resolvers = {
  Query: {
    currencies: () => Currency.find(),
    categories: () => Category.find(),
    news: () => News.find(),
  },
};

module.exports = resolvers;
