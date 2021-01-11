const constructorService = require('../constructor.services');
const {
  FRONT_POCKET_NOT_FOUND,
  FRONT_POCKET_ALREADY_EXIST
} = require('../../../error-messages/constructor-front-pocket-messages');
const ConstructorFrontPocket = require('./constructor-front-pocket.model');

const constructorFrontPocketQuery = {
  getAllConstructorFrontPocket: (parent, args) => constructorService.getAllConstructorElements(args, ConstructorFrontPocket),
  getConstructorFrontPocketById: async (parent, args) => {
    try {
      return await constructorService.getConstructorElementById(args.id, ConstructorFrontPocket, FRONT_POCKET_NOT_FOUND);
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
      return await constructorService.addConstructorElement(args.constructorElement, ConstructorFrontPocket, FRONT_POCKET_ALREADY_EXIST);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  updateConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorService.updateConstructorElement(args, ConstructorFrontPocket, FRONT_POCKET_NOT_FOUND);
    } catch (e) {
      return {
        statusCode: e.message === FRONT_POCKET_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
  deleteConstructorFrontPocket: async (parent, args) => {
    try {
      return await constructorService.deleteConstructorElement(args.id, ConstructorFrontPocket, FRONT_POCKET_NOT_FOUND);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};
module.exports = { constructorFrontPocketQuery, constructorFrontPocketMutation };
