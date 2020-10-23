const headerService = require('./header.service');
const { HEADER_NOT_FOUND } = require('../../error-messages/header.messages');

const headerQuery = {
  getAllHeaders: async (parent, args) => await headerService.getAllHeaders(),
  getHeaderById: async (parent, args) => {
    try {
      return await headerService.getHeaderById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const headerMutation = {
  addHeader: async (parent, args) => {
    try {
      return await headerService.addHeader(args);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  deleteHeader: async (parent, args) => {
    try {
      return await headerService.deleteHeader(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  updateHeader: async (parent, args) => {
    try {
      return await headerService.updateHeader(args);
    } catch (e) {
      return {
        statusCode: e.message === HEADER_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { headerQuery, headerMutation };
