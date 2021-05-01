const headerService = require('./header.service');
const RuleError = require('../../errors/rule.error');
const { HEADER_NOT_FOUND } = require('../../error-messages/header.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const headerQuery = {
  getAllHeaders: async (parent, args) => {
    try {
      return await headerService.getAllHeaders();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getHeaderById: async (parent, args) => {
    try {
      return await headerService.getHeaderById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const headerMutation = {
  addHeader: async (parent, args, { user }) => {
    try {
      return await headerService.addHeader(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteHeader: async (parent, args, { user }) => {
    try {
      return await headerService.deleteHeader(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateHeader: async (parent, args, { user }) => {
    try {
      return await headerService.updateHeader(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { headerQuery, headerMutation };
