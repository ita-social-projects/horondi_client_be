const colorService = require('./color.service');

const colorQuery = {
  getAllColors: async () => colorService.getAllColors(),

  getColorById: async (_, { id }) => {
    try {
      return await colorService.getColorById(id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const colorMutation = {
  addColor: async (_, { data }) => {
    try {
      return await colorService.addColor(data);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deleteColor: async (_, { id }) => {
    try {
      return await colorService.deleteColor(id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateColor: async (_, { id, color }) => {
    try {
      return await colorService.updateColor(id, color);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

module.exports = { colorQuery, colorMutation };
