const sizeService = require('./size.service');
const RuleError = require('../../errors/rule.error');

const sizeQuery = {
  getAllSizes: async (_, { limit, skip, filter }) => {
    try {
      return sizeService.getAllSizes(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getSizeById: async (parent, { id }) => {
    try {
      return sizeService.getSizeById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const sizeMutation = {
  addSize: async (parent, { size }, { user }) => {
    try {
      return sizeService.addSize(size, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteSize: async (parent, { id }, { user }) => {
    try {
      return sizeService.deleteSize(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateSize: async (parent, { id, size }, { user }) => {
    try {
      return sizeService.updateSize(id, size, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { sizeQuery, sizeMutation };
