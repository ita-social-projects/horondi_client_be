const sizeService = require('./size.service');

const sizeQuery = {
  getAllSizes: () => sizeService.getAllSizes(),

  getSizeById: async (_, { id }) => {
    try {
      return await sizeService.getSizeById(id);
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
      return await sizeService.addSize(data);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  deleteSize: async (_, { id }) => {
    try {
      return await sizeService.deleteSize(id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateSize: async (_, { id, size }) => {
    try {
      return await sizeService.updateSize(id, size);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

module.exports = { sizeQuery, sizeMutation };
