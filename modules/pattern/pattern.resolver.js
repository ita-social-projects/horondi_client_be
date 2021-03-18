const patternService = require('./pattern.service');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const patternQuery = {
  getAllPatterns: (parent, args) => patternService.getAllPatterns(args),
  getPatternById: async (parent, args) => {
    try {
      return await patternService.getPatternById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const patternMutation = {
  addPattern: async (parent, args) => {
    try {
      return await patternService.addPattern(args);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  deletePattern: async (parent, args) => {
    try {
      return await patternService.deletePattern(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  updatePattern: async (parent, args) => {
    try {
      return await patternService.updatePattern(args);
    } catch (e) {
      return {
        statusCode: e.message === PATTERN_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
};

module.exports = { patternQuery, patternMutation };
