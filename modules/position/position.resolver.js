const positionService = require('./position.service');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const positionQuery = {
  getAllPositions: async () => positionService.getAllPositions(),

  getPositionById: async (_, { id }) => {
    try {
      return await positionService.getPositionById(id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const positionMutation = {
  addPosition: async (_, { position }, { user }) => {
    console.log('position', position);
    try {
      return await positionService.addPosition(position, user);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  //   deletePosition: async (_, { id }, { user }) => {
  //     try {
  //       return await positionService.deletePosition(id, user);
  //     } catch (e) {
  //       return {
  //         statusCode: NOT_FOUND,
  //         message: e.message,
  //       };
  //     }
  //   },

  //   updatePosition: async (_, { id }, { user }) => {
  //     try {
  //       return await positionService.updatePosition(id, user);
  //     } catch (e) {
  //       return {
  //         statusCode: NOT_FOUND,
  //         message: e.message,
  //       };
  //     }
  //   }
};

module.exports = { positionQuery, positionMutation };
