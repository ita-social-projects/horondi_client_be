const bottomService = require('./bottom.service');

const RuleError = require('../../errors/rule.error');

const bottomQuery = {
  getAllBottoms: async (_, { limit, skip, filter }) => bottomService.getAllBottoms(limit, skip, filter),
  getBottomById: async (_, { id }) => {
    try {
      return await bottomService.getBottomById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const bottomMutation = {
  addBottom: async (_, { bottom, image }, { user }) => bottomService.addBottom(bottom, image, user),
  updateBottom: async (_, { id, bottom, image }, { user }) => {
    try {
      return await bottomService.updateBottom(id, bottom, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteBottom: async (_, { id }, { user }) => {
    try {
      return await bottomService.deleteBottom(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = {
  bottomQuery,
  bottomMutation,
};
