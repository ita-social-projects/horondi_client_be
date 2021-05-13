const sizeService = require('./size.service');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const sizeQuery = {
  getAllSizes: async (_, { limit, skip, filter }) => {
    try {
      return await sizeService.getAllSizes(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getSizeById: async (parent, { id }) => {
    try {
      return await sizeService.getSizeById(id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const sizeMutation = {
  addSize: async (parent, { size }, { user }) => {
    try {
      return await sizeService.addSize(size, user);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  deleteSize: async (parent, { id }, { user }) => {
    try {
      return await sizeService.deleteSize(id, user);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  updateSize: async (parent, { id, size }, { user }) => {
    try {
      return await sizeService.updateSize(id, size, user);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

module.exports = { sizeQuery, sizeMutation };
