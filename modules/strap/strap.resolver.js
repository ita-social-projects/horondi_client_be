const strapService = require('./strap.service');

const RuleError = require('../../errors/rule.error');

const strapQuery = {
  getAllStraps: async (_, { limit, skip, filter }) => {
    try {
      return await strapService.getAllStraps(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getStrapById: async (_, { id }) => {
    try {
      return await strapService.getStrapById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const strapMutation = {
  addStrap: async (_, { strap, image }, { user }) => {
    try {
      return await strapService.addStrap(strap, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateStrap: async (_, { id, strap, image }, { user }) => {
    try {
      return await strapService.updateStrap(id, strap, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteStrap: async (_, { id }, { user }) => {
    try {
      return await strapService.deleteStrap(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { strapQuery, strapMutation };
