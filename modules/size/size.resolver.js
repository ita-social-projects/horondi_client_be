const sizeService = require('./size.service');
const RuleError = require('../../errors/rule.error');

const sizeQuery = {
  getAllSizes: async (_, { limit, skip, filter }) => {
    try {
      return await sizeService.getAllSizes(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getSizeById: async (_parent, { id }) => {
    try {
      return await sizeService.getSizeById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const sizeMutation = {
  addSize: async (_parent, { size }, { user }) => {
    try {
      return await sizeService.addSize(size, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteSize: async (_parent, { id }, { user }) => {
    try {
      return await sizeService.deleteSize(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateSize: async (_parent, { id, size }, { user }) => {
    try {
      return await sizeService.updateSize(id, size, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { sizeQuery, sizeMutation };
