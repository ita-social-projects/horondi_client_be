const pocketService = require('./pocket.service');

const RuleError = require('../../errors/rule.error');

const pocketQuery = {
  getAllPockets: async (parent, args) => {
    try {
      const result = await pocketService.getAllPockets(args);
      return result;
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPocketById: async (parent, args) => {
    try {
      return await pocketService.getPocketById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPocketsByModel: async (parent, args) => {
    try {
      return await pocketService.getPocketsByModel(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const pocketMutation = {
  addPocket: async (parent, args, { user }) => {
    try {
      return await pocketService.addPocket(args.pocket, args.upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updatePocket: async (parent, args, { user }) => {
    try {
      return await pocketService.updatePocket(
        args.id,
        args.pocket,
        args.image,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deletePocket: async (parent, args, { user }) => {
    try {
      return await pocketService.deletePocket(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { pocketQuery, pocketMutation };
