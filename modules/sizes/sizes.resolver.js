const sizesService = require('./sizes.service');

const sizeQuery = {
  getAllSizes: () => sizesService.getAllSizes(),

  getSizeById: async (_, { id }) => {
    try {
      return await sizesService.getSizeById(id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const sizeMutation = {
  addSize: async (_, { data }) => {
    try {
      return await sizesService.addSize(data);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  deleteSize: async (_, { id }) => {
    try {
      return await sizesService.deleteSize(id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateSize: async (_, { id, size }) => {
    try {
      return await sizesService.updateSize(id, size);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

module.exports = { sizeQuery, sizeMutation };
