const sizeService = require('./size.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

const sizeQuery = {
  getAllSizes: () => sizeService.getAllSizes(),

  getSizeById: async (parent, { id }) => {
    try {
      return await sizeService.getSizeById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const sizeMutation = {
  addSize: async (parent, { size }, { user }) => {
    try {
      return await sizeService.addSize(size, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteSize: async (parent, { id }, { user }) => {
    try {
      return await sizeService.deleteSize(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateSize: async (parent, { id, size }, { user }) => {
    try {
      return await sizeService.updateSize(id, size, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { sizeQuery, sizeMutation };
