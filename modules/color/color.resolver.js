const colorService = require('./color.service');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const colorQuery = {
  getAllColors: async () => colorService.getAllColors(),

  getColorById: async (parent, { id }) => {
    try {
      return await colorService.getColorById(id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const colorMutation = {
  addColor: async (parent, { data }, { user }) => {
    try {
      return await colorService.addColor(data, user);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  deleteColor: async (parent, { id }, { user }) => {
    try {
      return await colorService.deleteColor(id, user);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

module.exports = { colorQuery, colorMutation };
