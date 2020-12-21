const constructorBasicService = require('./constructor-basic.services');
const {
  BASIC_NOT_FOUND,
} = require('../../../error-messages/constructor-basic-messages');

const constructorBasicQuery = {
  getAllBasics: (parent, args) => constructorBasicService.getAllBasics(args),
  getBasicById: async (parent, args) => {
    try {
      return await constructorBasicService.getBasicById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
}

const constructorBasicMutation = {
  addBasic: async (parent, args) => {
    try {
      return await constructorBasicService.addBasic(args.basic, args.upload);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  updateBasic: async (parent, args) => {
    try {
      return await constructorBasicService.updateBasic(args);
    } catch (e) {
      return {
        statusCode: e.message === BASIC_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
  deleteBasic: async (parent, args) => {
    try {
      return await constructorBasicService.deleteBasic(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};
module.exports = { constructorBasicQuery, constructorBasicMutation };
