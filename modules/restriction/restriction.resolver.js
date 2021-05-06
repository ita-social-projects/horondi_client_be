const restrictionService = require('./restriction.service');
const RuleError = require('../../errors/rule.error');

const restrictionMutation = {
  addRestriction: async (_, { restriction }, { user }) => {
    try {
      return await restrictionService.addRestriction(restriction, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateRestriction: async (_, { id, restriction }, { user }) => {
    try {
      return await restrictionService.updateRestriction(id, restriction, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteRestriction: async (_, { id }, { user }) => {
    try {
      return await restrictionService.deleteRestriction(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const restrictionQuery = {
  getAllRestrictions: async (_, args) => {
    try {
      return await restrictionService.getAllRestrictions(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getRestrictionById: async (_, { id }) => {
    try {
      return await restrictionService.getRestrictionById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { restrictionMutation, restrictionQuery };
