const backService = require('./back.service');

const RuleError = require('../../errors/rule.error');

const backQuery = {
  getAllBacks: async (_, { limit, skip, filter }) => {
    try {
      return await backService.getAllBacks(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getBackById: async (_, { id }) => {
    try {
      return await backService.getBackById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getBacksByModel: async (_, { id }) => {
    try {
      return await backService.getBacksByModel(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const backMutation = {
  addBack: async (_, { back, image }, { user }) => {
    try {
      return await backService.addBack(back, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateBack: async (_, { id, back, image }, { user }) => {
    try {
      return await backService.updateBack(id, back, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteBack: async (_, { id }, { user }) => {
    try {
      return await backService.deleteBack(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = {
  backQuery,
  backMutation,
};
