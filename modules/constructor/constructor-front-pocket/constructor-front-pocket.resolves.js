const constructorService = require('../constructor.services');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST,
} = require('../../../error-messages/constructor-front-pocket-messages');
const ConstructorFrontPocket = require('./constructor-front-pocket.model');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../../consts/status-codes');

const constructorFrontPocketQuery = {
  getAllConstructorFrontPocket: (parent, args) =>
    constructorService.getAllConstructorElements(args, ConstructorFrontPocket),
  getConstructorFrontPocketById: async (parent, args) => {
    try {
      return await constructorService.getConstructorElementById(
        args.id,
        ConstructorFrontPocket,
        FRONT_POCKET_NOT_FOUND
      );
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const constructorFrontPocketMutation = {
  addConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorService.addConstructorElement(
        args,
        ConstructorFrontPocket,
        FRONT_POCKET_ALREADY_EXIST
      );
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  updateConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorService.updateConstructorElement(
        args,
        ConstructorFrontPocket,
        FRONT_POCKET_NOT_FOUND
      );
    } catch (e) {
      return {
        statusCode:
          e.message === FRONT_POCKET_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
  deleteConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorService.deleteConstructorElement(
        args.id,
        ConstructorFrontPocket,
        FRONT_POCKET_NOT_FOUND
      );
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};
module.exports = {
  constructorFrontPocketQuery,
  constructorFrontPocketMutation,
};
