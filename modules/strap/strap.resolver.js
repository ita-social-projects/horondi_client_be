const strapService = require('./strap.service');

const RuleError = require('../../errors/rule.error');

const strapQuery = {
  getAllStraps: async (parent, args) => {
    try {
      const result = await strapService.getAllStraps(args);
      return result;
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
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
  addStrap: async (parent, args, { user }) => {
    try {
      return await strapService.addStrap(args.strap, args.image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateStrap: async (parent, args, { user }) => {
    try {
      return await strapService.updateStrap(
        args.id,
        args.strap,
        args.image,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteStrap: async (parent, args, { user }) => {
    try {
      return await strapService.deleteStrap(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { strapQuery, strapMutation };
