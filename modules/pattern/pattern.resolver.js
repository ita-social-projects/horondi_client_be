const patternService = require('./pattern.service');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');

const patternQuery = {
  getAllPatterns: () => patternService.getAllPatterns(),
  getPatternById: async (parent, args) => {
    try {
      return await patternService.getPatternById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const patternMutation = {
  addPattern: async (parent, args) => {
    const pattern = await patternService.addPattern(args.pattern);
    if (pattern) {
      return pattern;
    }
    return {
      statusCode: 400,
      message: PATTERN_NOT_FOUND,
    };
  },

  deletePattern: async (parent, args) => {
    const pattern = await patternService.deletePattern(args.id);
    if (pattern) {
      return pattern;
    }
    return {
      statusCode: 404,
      message: PATTERN_NOT_FOUND,
    };
  },

  updatePattern: async (parent, args) => {
    const pattern = await patternService.addPattern(args.id, args.pattern);
    if (pattern) {
      return pattern;
    }
    return {
      statusCode: 400,
      message: PATTERN_NOT_FOUND,
    };
  },
};

module.exports = { patternQuery, patternMutation };
