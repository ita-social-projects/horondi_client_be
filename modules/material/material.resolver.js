const materialService = require('./material.service');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');

const materialQuery = {
  getAllMaterials: async (parent, args) =>
    await materialService.getAllMaterials(args),
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
  getMaterialColorByCode: async (parent, args) => {
    const material = await materialService.getMaterialColorByCode(args.code);
    if (material[0].colors[0]) {
      return material[0].colors[0];
    }
    return {
      statusCode: 404,
      message: COLOR_NOT_FOUND,
    };
  },
};

const materialMutation = {
  addMaterial: async (parent, args) => {
    try {
      return await materialService.addMaterial(args);
    } catch (e) {
      return {
        statusCode: 400,
        message: e.message,
      };
    }
  },

  addMaterialColor: async (parent, args) => {
    args.color.images = args.image;
    try {
      return await materialService.addMaterialColor(
        args.id,
        args.color,
        args.image
      );
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
  deleteMaterialColor: async (parent, args) => {
    try {
      return await materialService.deleteMaterialColor(args.id, args.code);
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
