const patternService = require('./pattern.service');

const patternQuery = {
  getAllPatterns: () => patternService.getAllPatterns(),
  getPatternById: (parent, args) => patternService.getPatternById(args.id),
};

const patternMutation = {
  addPattern: (parent, args) => patternService.addPattern(args.pattern),
  deletePattern: (parent, args) => patternService.deletePattern(args.id),
  updatePattern: (parent, args) => patternService.updatePattern(args.id, args.pattern),
};

module.exports = { patternQuery, patternMutation };
