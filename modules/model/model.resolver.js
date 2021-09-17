const modelsService = require('./model.service');
const modelService = require('./model.service');
const RuleError = require('../../errors/rule.error');

const modelsQuery = {
  getAllModels: async (_, { filter, pagination, sort }) => {
    try {
      return await modelsService.getAllModels(filter, pagination, sort);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getModelsByCategory: async (_, { id }) => {
    try {
      return await modelsService.getModelsByCategory(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getModelById: async (_, { id }) => {
    try {
      return await modelService.getModelById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getModelsForConstructor: async (_, args) => {
    try {
      return await modelService.getModelsForConstructor();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const modelsMutation = {
  addModel: async (_, { model, upload }, { user }) => {
    try {
      return await modelsService.addModel(model, upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateModel: async (_, { id, model, upload }, { user }) => {
    try {
      return await modelService.updateModel(id, model, upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteModel: async (_, { id }, { user }) => {
    try {
      return await modelsService.deleteModel(id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  addModelConstructorBasic: async (_, { id, constructorElementID }) => {
    try {
      return await modelsService.addModelConstructorBasic(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorBasic: async (_, { id, constructorElementID }) => {
    try {
      return await modelsService.deleteModelConstructorBasic(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addModelConstructorPattern: async (_, { id, constructorElementID }) => {
    try {
      return await modelsService.addModelConstructorPattern(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorPattern: async (_, { id, constructorElementID }) => {
    try {
      return await modelsService.deleteModelConstructorPattern(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addModelConstructorFrontPocket: async (_, { id, constructorElementID }) => {
    try {
      return await modelsService.addModelConstructorFrontPocket(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorFrontPocket: async (
    _,
    { id, constructorElementID }
  ) => {
    try {
      return await modelsService.deleteModelConstructorFrontPocket(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addModelConstructorBottom: async (_, { id, constructorElementID }) => {
    try {
      return await modelsService.addModelConstructorBottom(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorBottom: async (_, { id, constructorElementID }) => {
    try {
      return await modelsService.deleteModelConstructorBottom(
        id,
        constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { modelsQuery, modelsMutation };
