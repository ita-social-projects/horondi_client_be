const positionService = require('./position.service');
const RuleError = require('../../errors/rule.error');

const positionQuery = {
  getAllPositions: async (_, { limit, skip, filter }) => {
    try {
      return await positionService.getAllPositions(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getPositionById: async (_, { id }) => {
    try {
      return await positionService.getPositionById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const positionMutation = {
  addPosition: async (_, { position }, { user }) => {
    try {
      return await positionService.addPosition(position, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deletePosition: async (_, { id }, { user }) => {
    try {
      return await positionService.deletePosition(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updatePosition: async (_, { id, position }, { user }) => {
    try {
      return await positionService.updatePosition(id, position, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { positionQuery, positionMutation };
