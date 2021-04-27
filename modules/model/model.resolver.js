const modelsService = require('./model.service');
const { MODEL_NOT_FOUND } = require('../../error-messages/model.messages');
const modelService = require('./model.service');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const modelsQuery = {
  getAllModels: async (parent, args) => await modelsService.getAllModels(args),

  getModelsByCategory: async (parent, args) =>
    await modelsService.getModelsByCategory(args.id),

  getModelById: async (parent, args) => {
    try {
      return await modelService.getModelById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  getModelsForConstructor: async (parent, args) => {
    try {
      return await modelService.getModelsForConstructor();
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const modelsMutation = {
  addModel: async (parent, args) => {
    try {
      return await modelsService.addModel(args.model, args.upload);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateModel: async (parent, args) => {
    try {
      return await modelService.updateModel(args.id, args.model, args.upload);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteModel: async (parent, args) => {
    try {
      return await modelsService.deleteModel(args.id);
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
