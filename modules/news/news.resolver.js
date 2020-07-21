const newsService = require('./news.service');
const { NEWS_NOT_FOUND } = require('../../error-messages/news.messages');

const newsQuery = {
  getAllNews: () => newsService.getAllNews(),
  getNewsById: async (parent, args) => {
    const news = await newsService.getNewsById(args.id);
    if (news) {
      return news;
    }
    return {
      statusCode: 404,
      message: NEWS_NOT_FOUND[args.language].value,
    };
  },
};
const newsMutation = {
  addNews: (parent, args) => newsService.addNews(args.news),
  deleteNews: (parent, args) => {
    const news = newsService.deleteNews(args.id);
    if (news) {
      return news;
    }
    return {
      statusCode: 404,
      message: NEWS_NOT_FOUND[args.language].value,
    };
  },
  updateNews: (parent, args) => {
    const news = newsService.updateNews(args.id, args.news);
    if (news) {
      return news;
    }
    return {
      statusCode: 404,
      message: NEWS_NOT_FOUND[args.language].value,
    };
  },
};

module.exports = { newsQuery, newsMutation };
