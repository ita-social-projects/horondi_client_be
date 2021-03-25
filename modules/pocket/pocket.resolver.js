const pocketService = require('./pocket.service');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const { POCKET_NOT_FOUND } = require('../../error-messages/pocket.messages');

const pocketQuery = {
  getAllPockets: (parent, args) => pocketService.getAllPockets(args),
  getPocketById: async (parent, args) => {
    try {
      return await pocketService.getPocketById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
  getPocketsByModel: async (parent, args) => {
    try {
      return await pocketService.getPocketsByModel(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const pocketMutation = {
  addPocket: async (parent, args) => {
    try {
      return await pocketService.addPocket(args);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },
  updatePocket: async (parent, args) => {
    try {
      return await pocketService.updatePocket(args);
    } catch (e) {
      return {
        statusCode: e.message === POCKET_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
  deletePocket: async (parent, args) => {
    try {
      return await pocketService.deletePocket(args);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

module.exports = { pocketQuery, pocketMutation };
