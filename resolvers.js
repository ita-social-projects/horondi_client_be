const { newsQuery } = require('./modules/news/news.resolver');
const { newsMutation } = require('./modules/news/news.resolver');

const resolvers = {
  Query: { ...newsQuery },
  Mutation: { ...newsMutation },
};

module.exports = resolvers;
