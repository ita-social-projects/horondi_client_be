const Currency = require('./models/Currency');
const Category = require('./models/Category');
const News = require('./models/News');

const resolvers = {
  Query: {
    currencies: () => Currency.find(),
    currency: (parent, args) => Currency.findById(args.id),
    categories: () => Category.find(),
    category: (parent, args) => Category.findById(args.id),
    allNews: () => News.find(),
    oneNews: (parent, args) => News.findById(args.id),
  },
};

module.exports = resolvers;
