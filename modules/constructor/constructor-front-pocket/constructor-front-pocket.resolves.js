const constructorService = require('../constructor.services');
const RuleError = require('../../../errors/rule.error');
const ConstructorFrontPocket = require('./constructor-front-pocket.model');

const constructorFrontPocketQuery = {
  getAllConstructorFrontPocket: async (_, args) => {
    try {
      return await constructorService.getAllConstructorElements(
        args,
        ConstructorFrontPocket
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getConstructorFrontPocketById: async (_, args) => {
    try {
      return await constructorService.getConstructorElementById(
        args.id,
        ConstructorFrontPocket
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const constructorFrontPocketMutation = {
  addConstructorFrontPocket: async (_, args, { user }) => {
    try {
      return await constructorService.addConstructorElement(
        args,
        ConstructorFrontPocket,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateConstructorFrontPocket: async (_, args, { user }) => {
    try {
      return await constructorService.updateConstructorElement(
        args,
        ConstructorFrontPocket,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteConstructorFrontPocket: async (_, args, { user }) => {
    try {
      return await constructorService.deleteConstructorElement(
        args.id,
        ConstructorFrontPocket,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};
module.exports = {
  constructorFrontPocketQuery,
  constructorFrontPocketMutation,
};
