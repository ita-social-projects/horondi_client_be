const constructorService = require('../constructor.services');
const RuleError = require('../../../errors/rule.error');
const ConstructorBottom = require('./constructor-bottom.model');

const constructorBottomQuery = {
  getConstructorBottomById: async (parent, args) => {
    try {
      return await constructorService.getConstructorElementById(
        args.id,
        ConstructorBottom
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getAllConstructorBottom: async (parent, args) =>
    await constructorService.getAllConstructorElements(args, ConstructorBottom),
};

const constructorBottomMutation = {
  addConstructorBottom: async (parent, args, { user }) => {
    try {
      return await constructorService.addConstructorElement(
        args,
        ConstructorBottom,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateConstructorBottom: async (parent, args, { user }) => {
    try {
      return await constructorService.updateConstructorElement(
        args,
        ConstructorBottom,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteConstructorBottom: async (parent, args, { user }) => {
    try {
      return await constructorService.deleteConstructorElement(
        args.id,
        ConstructorBottom,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { constructorBottomQuery, constructorBottomMutation };
