const newsService = require('./news.service');
const { NEWS_NOT_FOUND } = require('../../error-messages/news.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const newsQuery = {
  getAllNews: (parent, args) => newsService.getAllNews(args),
  getNewsById: async (parent, args) => {
    try {
      return await newsService.getNewsById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const newsMutation = {
  addNews: async (parent, args) => {
    try {
      return await newsService.addNews(args.news, args.upload);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },
  deleteNews: async (parent, args) => {
    try {
      return await newsService.deleteNews(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
  updateNews: async (parent, args) => {
    try {
      return await newsService.updateNews(args.id, args.news, args.upload);
    } catch (e) {
      return {
        statusCode: e.message === NEWS_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
};
module.exports = { newsQuery, newsMutation };
