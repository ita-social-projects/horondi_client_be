const newsService = require('./news.service');

const newsQuery = {
  getAllNews: () => newsService.getAllNews(),
  getNewsById: (parent, args) => newsService.getNewsById(args.id),
  deleteNews: (id) => newsService.deleteNews(id),
};
const newsMutation = {
  addNews: (data) => newsService.addNews(data),
};

module.exports = { newsQuery, newsMutation };
