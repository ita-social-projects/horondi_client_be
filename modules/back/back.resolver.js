const backService = require('./back.service');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const { BACK_NOT_FOUND } = require('../../consts/back-messages');

const backQuery = {
  getAllBacks: (parent, args) => backService.getAllBacks(args),
  getBackById: async (parent, args) => {
    try {
      return await backService.getBackById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
  getBacksByModel: async (parent, args) => {
    try {
      return await backService.getBacksByModel(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const backMutation = {
  addBack: async (parent, args) => {
    try {
      return await backService.addBack(args);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },
  updateBack: async (parent, args) => {
    try {
      return await backService.updateBack(args);
    } catch (e) {
      return {
        statusCode: e.message === BACK_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
  deleteBack: async (parent, args) => {
    try {
      return await backService.deleteBack(args);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

module.exports = {
  backQuery,
  backMutation,
};
