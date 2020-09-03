const newsService = require('./news.service');
const { NEWS_NOT_FOUND } = require('../../error-messages/news.messages');

const newsQuery = {
  getAllNews: (parent, args) => newsService.getAllNews(args),
  getNewsById: async (parent, args) => {
    try {
      return await newsService.getNewsById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};
const newsMutation = {
  addNews: async (parent, args) => {
    try {
      return await newsService.addNews(args.news);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteNews: async (parent, args) => {
    try {
      return await newsService.deleteNews(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
  updateNews: async (parent, args) => {
    try {
      return await newsService.updateNews(args.id, args.news);
    } catch (e) {
      return {
        statusCode: e.message === NEWS_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};
module.exports = { newsQuery, newsMutation };
