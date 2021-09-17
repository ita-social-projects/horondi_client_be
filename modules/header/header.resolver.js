const headerService = require('./header.service');
const RuleError = require('../../errors/rule.error');

const headerQuery = {
  getAllHeaders: async (parent, args) => headerService.getAllHeaders(),
  getHeaderById: async (parent, args) => {
    try {
      return await headerService.getHeaderById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const headerMutation = {
  addHeader: async (parent, args, { user }) => {
    try {
      return await headerService.addHeader(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteHeader: async (parent, args, { user }) => {
    try {
      return await headerService.deleteHeader(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateHeader: async (parent, args, { user }) => {
    try {
      return await headerService.updateHeader(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { headerQuery, headerMutation };
