const materialService = require('./material.service');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const materialQuery = {
  getAllMaterials: async (parent, args) =>
    await materialService.getAllMaterials(args),
  getMaterialById: async (parent, args) => {
    const material = await materialService.getMaterialById(args.id);
    if (material) {
      return material;
    }
    return {
      statusCode: NOT_FOUND,
      message: MATERIAL_NOT_FOUND,
    };
  },
  getMaterialsByPurpose: (parent, args) =>
    materialService.getMaterialsByPurposes(args.purposes),
};

const materialMutation = {
  addMaterial: async (parent, args) => {
    try {
      return await materialService.addMaterial(args);
    } catch (e) {
      return {
        statusCode: BAD_REQUEST,
        message: e.message,
      };
    }
  },

  deleteMaterial: async (parent, args) => {
    try {
      return await materialService.deleteMaterial(args.id);
    } catch (e) {
      return {
        statusCode: NOT_FOUND,
        message: e.message,
      };
    }
  },

  updateMaterial: async (parent, args) => {
    try {
      return await materialService.updateMaterial(args.id, args.material);
    } catch (e) {
      return {
        statusCode: e.message === MATERIAL_NOT_FOUND ? NOT_FOUND : BAD_REQUEST,
        message: e.message,
      };
    }
  },
};

module.exports = { materialQuery, materialMutation };
