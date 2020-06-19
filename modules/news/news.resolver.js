const News = require('../../models/News');

const newsQuery = {
  allNews: () => News.find(),
  oneNews: (parent, args) => News.findById(args.id),
};

module.exports = newsQuery;
