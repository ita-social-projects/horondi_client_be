const pocketService = require('./pocket.service');

const RuleError = require('../../errors/rule.error');

const pocketQuery = {
  getAllPockets: async (_, { limit, skip, filter }) => {
    try {
      return await pocketService.getAllPockets(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getPocketById: async (_, { id }) => {
    try {
      return await pocketService.getPocketById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const pocketMutation = {
  addPocket: async (_, { pocket, images }, { user }) => {
    try {
      return await pocketService.addPocket(pocket, images, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updatePocket: async (_, { id, pocket, image }, { user }) => {
    try {
      return await pocketService.updatePocket(id, pocket, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deletePocket: async (_, { id }, { user }) => {
    try {
      return await pocketService.deletePocket(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { pocketQuery, pocketMutation };
