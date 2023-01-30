const newsService = require('./news.service');
const RuleError = require('../../errors/rule.error');

const newsQuery = {
  getAllNews: (_parent, args) => newsService.getAllNews(args),
  getNewsById: async (_parent, args) => {
    try {
      return await newsService.getNewsById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const newsMutation = {
  addNews: async (_parent, args, { user }) => {
    try {
      return await newsService.addNews(args.news, args.upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteNews: async (_parent, args, { user }) => {
    try {
      return await newsService.deleteNews(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateNews: async (_parent, args, { user }) => {
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
