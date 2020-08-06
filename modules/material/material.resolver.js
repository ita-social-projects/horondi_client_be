const materialService = require('./material.service');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

const materialQuery = {
  getAllMaterials: () => materialService.getAllMaterials(),
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
    const material = await materialService.deleteMaterial(args.id);
    if (material) {
      return material;
    }
    return {
      statusCode: 404,
      message: MATERIAL_NOT_FOUND,
    };
  },
  updateMaterial: async (parent, args) => {
    const material = await materialService.updateMaterial(
      args.id,
      args.material
    );
    if (material) {
      return material;
    }
    return {
      statusCode: 400,
      message: MATERIAL_NOT_FOUND,
    };
  },
};

module.exports = { materialQuery, materialMutation };
