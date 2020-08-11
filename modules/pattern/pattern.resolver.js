const patternService = require('./pattern.service');

const patternQuery = {
  getAllPatterns: () => patternService.getAllPatterns(),
  getPatternById: async (parent, args) => {
    try {
      return await patternService.getPatternById(args.id, args.pattern);
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
    try {
      return await patternService.addPattern(args.pattern);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deletePattern: async (parent, args) => {
    try {
      return await patternService.deletePattern(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updatePattern: async (parent, args) => {
    try {
      return await patternService.addPattern(args.id, args.pattern);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
};

module.exports = { patternQuery, patternMutation };
