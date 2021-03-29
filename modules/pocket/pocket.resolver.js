const pocketService = require('./pocket.service');

const RuleError = require('../../errors/rule.error');

const pocketQuery = {
  getAllPockets: (parent, args) => pocketService.getAllPockets(args),
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
  addPocket: async (parent, args) => {
    try {
      return await pocketService.addPocket(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updatePocket: async (parent, args) => {
    try {
      return await pocketService.updatePocket(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deletePocket: async (parent, args) => {
    try {
      return await pocketService.deletePocket(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { pocketQuery, pocketMutation };
