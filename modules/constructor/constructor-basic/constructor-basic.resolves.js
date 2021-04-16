const constructorService = require('../constructor.services');
const RuleError = require('../../../errors/rule.error');
const ConstructorBasic = require('./constructor-basic.model');

const constructorBasicQuery = {
  getAllConstructorBasics: (parent, args) =>
    constructorService.getAllConstructorElements(args, ConstructorBasic),
  getConstructorBasicById: async (parent, args) => {
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
  addConstructorBasic: async (parent, args, { user }) => {
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

  updateConstructorBasic: async (parent, args, { user }) => {
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
  deleteConstructorBasic: async (parent, args, { user }) => {
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
