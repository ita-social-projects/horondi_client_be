const Pattern = require('./patterns.service');

const patternQuery = {
  getAllPatterns: () => Pattern.getAllPatterns(),
  getPatternById: (parent, args) => Pattern.getPatternById(args.id),
};

const patternMutation = {
  addPattern: (parent, args) => Pattern.addPattern(args.pattern),
  deletePattern: (parent, args) => Pattern.deletePattern(args.id),
};

module.exports = { patternQuery, patternMutation };
