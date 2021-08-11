const basicsService = require('./basics.service');

const RuleError = require('../../errors/rule.error');

const basicsQuery = {
  getAllBasics: async (_, { limit, skip, filter }) =>
    basicsService.getAllBasics(limit, skip, filter),
  getBasicsById: async (_, { id }) => {
    try {
      return await basicsService.getBasicsById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const basicsMutations = {
  addBasics: async (_, { basic, image }, { user }) =>
    basicsService.addBasics(basic, image, user),
  updateBasics: async (_, { id, basic, image }, { user }) => {
    try {
      return await basicsService.updateBasics(id, basic, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteBasics: async (_, { id }, { user }) => {
    try {
      return await basicsService.deleteBasics(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = {
  basicsQuery,
  basicsMutations,
};
