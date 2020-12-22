const constructorFrontPocketService = require('./constructor-front-pocket.services');
const {
  FRONT_POCKET_NOT_FOUND
} = require('../../../error-messages/constructor-front-pocket-messages');

const constructorFrontPocketQuery = {
  getAllConstructorFrontPocket: (parent, args) => constructorFrontPocketService.getAllConstructorFrontPocket(args),
  getConstructorFrontPocketById: async (parent, args) => {
    try {
      return await constructorFrontPocketService.getConstructorFrontPocketById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
}

const constructorFrontPocketMutation = {
  addConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorFrontPocketService.addConstructorFrontPocket(args.pocket, args.upload);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  updateConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorFrontPocketService.updateConstructorFrontPocket(args);
    } catch (e) {
      return {
        statusCode: e.message === FRONT_POCKET_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
  deleteConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorFrontPocketService.deleteConstructorFrontPocket(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};
module.exports = { constructorFrontPocketQuery, constructorFrontPocketMutation };
