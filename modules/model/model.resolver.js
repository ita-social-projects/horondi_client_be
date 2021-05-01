const modelsService = require('./model.service');
const modelService = require('./model.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

const modelsQuery = {
  getAllModels: async (parent, args) => await modelsService.getAllModels(args),

  getModelsByCategory: async (parent, args) =>
    await modelsService.getModelsByCategory(args.id),

  getModelById: async (parent, args) => {
    try {
      return await modelService.getModelById(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  getModelsForConstructor: async (parent, args) => {
    try {
      return await modelService.getModelsForConstructor();
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },
};

const modelsMutation = {
  addModel: async (parent, args, { user }) => {
    try {
      return await modelsService.addModel(args.model, args.upload, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateModel: async (parent, args, { user }) => {
    try {
      return await modelService.updateModel(
        args.id,
        args.model,
        args.upload,
        user
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteModel: async (parent, args, { user }) => {
    try {
      return await modelsService.deleteModel(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  addModelConstructorBasic: async (parent, args) => {
    try {
      return await modelsService.addModelConstructorBasic(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorBasic: async (parent, args) => {
    try {
      return await modelsService.deleteModelConstructorBasic(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addModelConstructorPattern: async (parent, args) => {
    try {
      return await modelsService.addModelConstructorPattern(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorPattern: async (parent, args) => {
    try {
      return await modelsService.deleteModelConstructorPattern(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addModelConstructorFrontPocket: async (parent, args) => {
    try {
      return await modelsService.addModelConstructorFrontPocket(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorFrontPocket: async (parent, args) => {
    try {
      return await modelsService.deleteModelConstructorFrontPocket(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  addModelConstructorBottom: async (parent, args) => {
    try {
      return await modelsService.addModelConstructorBottom(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  deleteModelConstructorBottom: async (parent, args) => {
    try {
      return await modelsService.deleteModelConstructorBottom(
        args.id,
        args.constructorElementID
      );
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { modelsQuery, modelsMutation };
