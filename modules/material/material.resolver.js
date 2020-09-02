const materialService = require('./material.service');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

const materialQuery = {
  getAllMaterials: (parent, args) => materialService.getAllMaterials(args),
  getMaterialById: async (parent, args) => {
    try {
      return await materialService.getMaterialById(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
};

const materialMutation = {
  addMaterial: async (parent, args) => {
    try {
      return await materialService.addMaterial(args.material);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },
  deleteMaterial: async (parent, args) => {
    try {
      return await materialService.deleteMaterial(args.id);
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
      };
    }
  },
  updateMaterial: async (parent, args) => {
    try {
      return await materialService.updateMaterial(args.id, args.material);
    } catch (e) {
      return {
        statusCode: e.message === MATERIAL_NOT_FOUND ? 404 : 400,
        message: e.message,
      };
    }
  },
};

module.exports = { materialQuery, materialMutation };
