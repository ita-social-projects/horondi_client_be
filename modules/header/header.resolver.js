const headerService = require('./header.service');
const { HEADER_NOT_FOUND } = require('../../error-messages/header.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const headerQuery = {
  getAllHeaders: async (parent, args) => await headerService.getAllHeaders(),
  getHeaderById: async (parent, args) => {
    try {
      return await headerService.getHeaderById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
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
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  deleteHeader: async (parent, args) => {
    try {
      return await headerService.deleteHeader(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  updateHeader: async (parent, args) => {
    try {
      return await headerService.updateHeader(args);
    } catch (e) {
      return {
        statusCode: e.message === HEADER_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
};

module.exports = { headerQuery, headerMutation };
