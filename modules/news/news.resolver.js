const newsService = require('./news.service');
const RuleError = require('../../errors/rule.error');
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
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const newsMutation = {
  addNews: async (parent, args, { user }) => {
    try {
      return await newsService.addNews(args.news, args.upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteNews: async (parent, args, { user }) => {
    try {
      return await newsService.deleteNews(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateNews: async (parent, args, { user }) => {
    try {
      return await newsService.updateNews(
        args.id,
        args.news,
        args.upload,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};
module.exports = { newsQuery, newsMutation };
