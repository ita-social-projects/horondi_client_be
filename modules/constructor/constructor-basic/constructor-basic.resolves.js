const constructorService = require('../constructor.services');
const RuleError = require('../../../errors/rule.error');
const ConstructorBasic = require('./constructor-basic.model');

const constructorBasicQuery = {
  getAllConstructorBasics: async (_, args) => {
    try {
      return await constructorService.getAllConstructorElements(
        args,
        ConstructorBasic
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getConstructorBasicById: async (_, args) => {
    try {
      return await constructorService.getConstructorElementById(
        args.id,
        ConstructorBasic
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const constructorBasicMutation = {
  addConstructorBasic: async (_, args, { user }) => {
    try {
      return await constructorService.addConstructorElement(
        args,
        ConstructorBasic,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateConstructorBasic: async (_, args, { user }) => {
    try {
      return await constructorService.updateConstructorElement(
        args,
        ConstructorBasic,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteConstructorBasic: async (_, args, { user }) => {
    try {
      return await constructorService.deleteConstructorElement(
        args.id,
        ConstructorBasic,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};
module.exports = { constructorBasicQuery, constructorBasicMutation };
