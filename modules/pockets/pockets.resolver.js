const PocketService = require('./pockets.service');
const {
  STATUS_CODES: { BAD_REQUEST },
} = require('../../consts/status-codes');
const pocketQuery = {};

const pocketMutation = {
  addPocket: async (parent, args) => {
    try {
      return await PocketService.addPocket(args);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },
};

module.exports = { pocketQuery, pocketMutation };
