const restrictionService = require('./restriction.service');
const RuleError = require('../../errors/rule.error');

const restrictionMutation = {
  addRestriction: async (parent, args, { user }) => {
    try {
      return await restrictionService.addRestriction(args.restriction, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateRestriction: async (parent, args, { user }) => {
    try {
      return await restrictionService.updateRestriction(
        args.id,
        args.restriction,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteRestriction: async (parent, args, { user }) => {
    try {
      return await restrictionService.deleteRestriction(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const restrictionQuery = {
  getAllRestrictions: (parent, args) => {
    try {
      const result = await restrictionService.getAllRestrictions(args);
      return result;
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getRestrictionById: async (parent, args) => {
    try {
      return await restrictionService.getRestrictionById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { restrictionMutation, restrictionQuery };
