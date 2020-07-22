const materialService = require('./material.service');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

const materialQuery = {
  getAllMaterials: () => materialService.getAllMaterials(),
  getMaterialById: async (parent, args) => {
    const material = await materialService.getMaterialById(args.id);
    if (material) {
      return material;
    }
    return {
      statusCode: 404,
      message: MATERIAL_NOT_FOUND,
    };
  },
};

const materialMutation = {
  addMaterial: (parent, args) => materialService.addMaterial(args.material),
  deleteMaterial: (parent, args) => {
    const material = materialService.deleteMaterial(args.id);
    if (material) {
      return material;
    }
    return {
      statusCode: 404,
      message: MATERIAL_NOT_FOUND,
    };
  },
  updateMaterial: (parent, args) => {
    const material = materialService.updateMaterial(args.id, args.material);
    if (material) {
      return material;
    }
    return {
      statusCode: 404,
      message: MATERIAL_NOT_FOUND,
    };
  },
};

module.exports = { materialQuery, materialMutation };
