const patternService = require('./pattern.service');
const RuleError = require('../../errors/rule.error');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const patternQuery = {
  getAllPatterns: async (parent, args) => {
    try {
      return await patternService.getAllPatterns(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPatternById: async (parent, args) => {
    try {
      return await patternService.getPatternById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const patternMutation = {
  addPattern: async (parent, args, { user }) => {
    try {
      return await patternService.addPattern(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deletePattern: async (parent, args, { user }) => {
    try {
      return await patternService.deletePattern(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updatePattern: async (parent, args, { user }) => {
    try {
      return await patternService.updatePattern(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { patternQuery, patternMutation };
