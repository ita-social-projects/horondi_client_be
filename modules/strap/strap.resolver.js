const strapService = require('./strap.service');

const RuleError = require('../../errors/rule.error');

const strapQuery = {
  getAllStraps: (parent, args) => strapService.getAllStraps(args),
  getStrapById: async (parent, args) => {
    try {
      return await strapService.getStrapById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getStrapsByModel: async (parent, args) => {
    try {
      return await strapService.getStrapsByModel(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const strapMutation = {
  addStrap: async (parent, args) => {
    try {
      return await strapService.addStrap(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateStrap: async (parent, args) => {
    try {
      return await strapService.updateStrap(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteStrap: async (parent, args) => {
    try {
      return await strapService.deleteStrap(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { strapQuery, strapMutation };
