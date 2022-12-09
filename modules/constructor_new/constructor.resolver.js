const constructorService = require('./constructor.service');

const RuleError = require('../../errors/rule.error');

const constructorQuery = {
  getAllConstructors: async (_, { limit, skip, filter }) => {
    try {
      return await constructorService.getAllConstructors(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getAllConstructorParts: async () => {
    try {
      return await constructorService.getAllConstructorParts();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getConstructorById: async (_, { id }) => {
    try {
      return await constructorService.getConstructorById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getConstructorByModel: async (_, { id }) => {
    try {
      return await constructorService.getConstructorByModel(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const constructorMutation = {
  addConstructor: async (_, { constructor, image }, { user }) => {
    try {
      return await constructorService.addConstructor(constructor, image, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  updateConstructor: async (_, { id, constructor, image }, { user }) => {
    try {
      return await constructorService.updateConstructor(
        id,
        constructor,
        image,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteConstructor: async (_, { id }, { user }) => {
    try {
      return await constructorService.deleteConstructor(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { constructorQuery, constructorMutation };
