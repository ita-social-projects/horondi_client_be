const constructorBasicService = require('./constructor-basic.services');
const {
  BASIC_NOT_FOUND,
} = require('../../../error-messages/constructor-basic-messages');

const constructorBasicQuery = {
  getAllConstructorBasics: (parent, args) => constructorBasicService.getAllConstructorBasics(args),
  getConstructorBasicById: async (parent, args) => {
    try {
      return await constructorBasicService.getConstructorBasicById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
}

const constructorBasicMutation = {
  addConstructorBasic: async (parent, args) => {
    try {
     return await constructorBasicService.addConstructorBasic(args.constructorElement);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  updateConstructorBasic: async (parent, args) => {
    try {
      return await constructorBasicService.updateConstructorBasic(args);
    } catch (e) {
      return {
        statusCode: e.message === BASIC_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
  deleteConstructorBasic: async (parent, args) => {
    try {
      return await constructorBasicService.deleteConstructorBasic(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};
module.exports = { constructorBasicQuery, constructorBasicMutation };
