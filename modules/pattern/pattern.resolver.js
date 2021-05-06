const patternService = require('./pattern.service');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');
const { uploadFiles, deleteFiles } = require('../upload/upload.service');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const patternQuery = {
  getAllPatterns: (_, args) => patternService.getAllPatterns(args),
  getPatternById: async (_, { id }) => {
    try {
      return await patternService.getPatternById(id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const patternMutation = {
  addPattern: async (_, args, { user }) => {
    try {
      return await patternService.addPattern(args, user);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  deletePattern: async (_, { id }, { user }) => {
    try {
      return await patternService.deletePattern(id, user);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  updatePattern: async (_, args, { user }) => {
    try {
      return await patternService.updatePattern(args, user);
    } catch (e) {
      return {
        statusCode: e.message === PATTERN_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
};

module.exports = { patternQuery, patternMutation };
