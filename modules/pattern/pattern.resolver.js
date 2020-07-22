const patternService = require('./pattern.service');
const { PATTERN_NOT_FOUND } = require('../../error-messages/pattern.messages');

const patternQuery = {
  getAllPatterns: () => patternService.getAllPatterns(),
  getPatternById: async (parent, args) => {
    const pattern = await patternService.getPatternById(args.id);
    if (pattern) {
      return pattern;
    }
    return {
      statusCode: 404,
      message: PATTERN_NOT_FOUND,
    };
  },
};

const patternMutation = {
  addPattern: (parent, args) => patternService.addPattern(args.pattern),
  deletePattern: (parent, args) => {
    const pattern = patternService.deletePattern(args.id);
    if (pattern) {
      return pattern;
    }
    return {
      statusCode: 404,
      message: PATTERN_NOT_FOUND,
    };
  },
  updatePattern: (parent, args) => {
    const pattern = patternService.updatePattern(args.id, args.pattern);
    if (pattern) {
      return pattern;
    }
    return {
      statusCode: 404,
      message: PATTERN_NOT_FOUND,
    };
  },
};

module.exports = { patternQuery, patternMutation };
