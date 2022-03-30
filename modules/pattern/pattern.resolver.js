const patternService = require('./pattern.service');
const RuleError = require('../../errors/rule.error');

const patternQuery = {
  getAllPatterns: async (_, { limit, skip, filter }) => {
    try {
      return await patternService.getAllPatterns(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPatternById: async (_, { id }) => {
    try {
      return await patternService.getPatternById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const patternMutation = {
  addPattern: async (_, args, { user }) => {
    try {
      return await patternService.addPattern(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deletePattern: async (_, { id }, { user }) => {
    try {
      return await patternService.deletePattern(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updatePattern: async (_, args, { user }) => {
    try {
      return await patternService.updatePattern(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { patternQuery, patternMutation };
