const modelsService = require('./model.service');
const { MODEL_NOT_FOUND } = require('../../error-messages/model.messages');
const modelService = require('./model.service');

const modelsQuery = {
  getAllModels: async (parent, args) => await modelsService.getAllModels(args),

  getModelsByCategory: async (parent, args) =>
    await modelsService.getModelsByCategory(args.id),

  getModelById: async (parent, args) => {
    try {
      return await modelService.getModelById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const modelsMutation = {
  addModel: async (parent, args) => {
    try {
      return await modelsService.addModel(args.model, args.upload);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  updateModel: async (parent, args) => {
    try {
      return await modelService.updateModel(args.id, args.model, args.upload);
    } catch (e) {
      return {
        statusCode: e.message === MODEL_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },

  deleteModel: async (parent, args) => {
    const deletedModel = await modelsService.deleteModel(args.id);
    if (deletedModel) {
      return deletedModel;
    }
    return {
      statusCode: 404,
      message: MODEL_NOT_FOUND,
    };
  },

  addModelConstructorBottom: async (parent, args) => {
    return await modelsService.addModelConstructorBottom(args.id, args.basicID);
    return {
      statusCode: 404,
      message: MODEL_NOT_FOUND,
    };
  },
};

module.exports = { modelsQuery, modelsMutation };
