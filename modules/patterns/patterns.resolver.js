const Pattern = require('./patterns.service');

const patternQuery = {
  getAllPatterns: () => Pattern.getAllPatterns(),
  getPatternById: (parent, args) => Pattern.getPatternById(args.id),
};

module.exports = patternQuery;
