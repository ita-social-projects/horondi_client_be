const backService = require('./back.service');

const RuleError = require('../../errors/rule.error');

const backQuery = {
  getAllBacks: (parent, args) => backService.getAllBacks(args),
  getBackById: async (parent, args) => {
    try {
      return await backService.getBackById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getBacksByModel: async (parent, args) => {
    try {
      return await backService.getBacksByModel(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const backMutation = {
  addBack: async (parent, args, { user }) => {
    try {
      return await backService.addBack(args.back, args.image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateBack: async (parent, args, { user }) => {
    try {
      return await backService.updateBack(args.id, args.back, args.image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteBack: async (parent, args, { user }) => {
    try {
      return await backService.deleteBack(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = {
  backQuery,
  backMutation,
};
