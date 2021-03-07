const constructorService = require('../constructor.services');
const {
  BASIC_NOT_FOUND,
  BASIC_ALREADY_EXIST,
} = require('../../../error-messages/constructor-basic-messages');
const ConstructorBasic = require('./constructor-basic.model');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../../consts/status-codes');

const constructorBasicQuery = {
  getAllConstructorBasics: (parent, args) =>
    constructorService.getAllConstructorElements(args, ConstructorBasic),
  getConstructorBasicById: async (parent, args) => {
    try {
      return await constructorService.getConstructorElementById(
        args.id,
        ConstructorBasic,
        BASIC_NOT_FOUND
      );
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const constructorBasicMutation = {
  addConstructorBasic: async (parent, args) => {
    try {
      return await constructorService.addConstructorElement(
        args,
        ConstructorBasic,
        BASIC_ALREADY_EXIST
      );
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  updateConstructorBasic: async (parent, args) => {
    try {
      return await constructorService.updateConstructorElement(
        args,
        ConstructorBasic,
        BASIC_NOT_FOUND
      );
    } catch (e) {
      return {
        statusCode: e.message === BASIC_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
  deleteConstructorBasic: async (parent, args) => {
    try {
      return await constructorService.deleteConstructorElement(
        args.id,
        ConstructorBasic,
        BASIC_NOT_FOUND
      );
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};
module.exports = { constructorBasicQuery, constructorBasicMutation };
