const newsResolvers = require('./modules/news/news.resolver');

const resolvers = {
  Query: { ...newsResolvers },
};

module.exports = resolvers;
