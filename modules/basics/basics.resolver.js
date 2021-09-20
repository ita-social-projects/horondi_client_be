const basicsService = require('./basics.service');

const RuleError = require('../../errors/rule.error');

const basicsQuery = {
  getAllBasics: async (_, { limit, skip, filter }) =>
    basicsService.getAllBasics(limit, skip, filter),
  getBasicById: async (_, { id }) => {
    try {
      return await basicsService.getBasicById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const basicsMutations = {
  addBasic: async (_, { basic, image }, { user }) => {
    try {
      return await basicsService.addBasic(basic, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateBasic: async (_, { id, basic, image }, { user }) => {
    try {
      return await basicsService.updateBasic(id, basic, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteBasic: async (_, { id }, { user }) => {
    try {
      return await basicsService.deleteBasic(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = {
  basicsQuery,
  basicsMutations,
};
