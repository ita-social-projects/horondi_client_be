const newsService = require('./news.service');

const newsQuery = {
  getAllNews: () => newsService.getAllNews(),
  getNewsById: (parent, args) => newsService.getNewsById(args.id),
};
const newsMutation = {
  addNews: (parent, args) => newsService.addNews(args.news),
  deleteNews: (parent, args) => newsService.deleteNews(args.id),
  updateNews: (parent, args) => newsService.updateNews(args.id, args.news),
};

module.exports = { newsQuery, newsMutation };
