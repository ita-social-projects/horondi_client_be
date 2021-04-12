const restrictionService = require('./restriction.service');
const RuleError = require('../../errors/rule.error');

const restrictionMutation = {
  addRestriction: async (parent, args) => {
    try {
      return await restrictionService.addRestriction(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateRestriction: async (parent, args) => {
    try {
      return await restrictionService.updateRestriction(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteRestriction: async (parent, args) => {
    try {
      return await restrictionService.deleteRestriction(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const restrictionQuery = {
  getAllRestrictions: (parent, args) =>
    restrictionService.getAllRestrictions(args),
};

module.exports = { restrictionMutation, restrictionQuery };
