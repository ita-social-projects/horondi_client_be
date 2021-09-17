const colorService = require('./color.service');
const RuleError = require('../../errors/rule.error');

const colorQuery = {
  getAllColors: async () => colorService.getAllColors(),

  getColorById: async (parent, { id }) => {
    try {
      return await colorService.getColorById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const colorMutation = {
  addColor: async (parent, { data }, { user }) => {
    try {
      return await colorService.addColor(data, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteColor: async (parent, { id }, { user }) => {
    try {
      return await colorService.deleteColor(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { colorQuery, colorMutation };
