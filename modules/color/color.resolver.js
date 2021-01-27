const colorService = require('./color.service');

const colorQuery = {
  getAllColors: async () => colorService.getAllColors(),

  getColorById: async (parent, { id }) => {
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
  addColor: async (parent, { data }) => {
    try {
      return await colorService.addColor(data);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deleteColor: async (parent, { id }) => {
    try {
      return await colorService.deleteColor(id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

module.exports = { colorQuery, colorMutation };
