const Pattern = require('./patterns.service');

const PatternQuery = {
  getAllPatterns: () => Pattern.getAllPatterns(),
  getPatternById: (parent, args) => Pattern.getPatternById(args.id),
};

const PatternMutation = {
  addPattern: (parent, args) => Pattern.addPattern(args.pattern),
  deletePattern: (parent, args) => Pattern.deletePattern(args.id),
};

module.exports = { PatternQuery, PatternMutation };
