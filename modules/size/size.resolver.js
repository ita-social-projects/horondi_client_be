const sizesService = require('./size.service');

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

module.exports = { sizeQuery };
