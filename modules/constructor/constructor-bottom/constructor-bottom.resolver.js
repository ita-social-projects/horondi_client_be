const constructorBottomService = require('./constructor-bottom.service');
const {
  CONSTRUCTOR_BOTTOM_NOT_FOUND,
} = require('../../../error-messages/constructor-bottom.messages');

const constructorBottomQuery = {
  getConstructorBottomById: async (parent, args) => {
    try {
      return await constructorBottomService.getConstructorBottomById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },

  getAllConstructorBottom: async () =>
    await constructorBottomService.getAllConstructorBottom(),
};

const constructorBottomMutation = {
  addConstructorBottom: async (parent, args) => {
    try {
      return await constructorBottomService.addConstructorBottom(
        args.constructorBottom,
        args.upload
      );
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  updateConstructorBottom: async (parent, args) => {
    try {
      return await constructorBottomService.updateConstructorBottom(
        args.id,
        args.constructorBottom,
        args.upload
      );
    } catch (e) {
      return {
        statusCode: e.message === CONSTRUCTOR_BOTTOM_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },

  deleteConstructorBottom: async (parent, args) => {
    const deletedModel = await constructorBottomService.deleteConstructorBottom(
      args.id
    );
    if (deletedModel) {
      return deletedModel;
    }
    return {
      statusCode: 404,
      message: e.message,
    };
  },
};

module.exports = { constructorBottomQuery, constructorBottomMutation };
