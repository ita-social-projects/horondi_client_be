const materialService = require('./material.service');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const materialQuery = {
  getAllMaterials: async (parent, args) =>
    await materialService.getAllMaterials(args),
  getMaterialById: async (parent, args) => {
    const material = await materialService.getMaterialById(args.id);
    if (material) {
      return material;
    }
    return new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);
  },
  getMaterialsByPurpose: (parent, args) =>
    materialService.getMaterialsByPurposes(args.purposes),
};

const materialMutation = {
  addMaterial: async (parent, args, { user }) => {
    try {
      return await materialService.addMaterial(args, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  deleteMaterial: async (parent, args, { user }) => {
    try {
      return await materialService.deleteMaterial(args.id, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },

  updateMaterial: async (parent, args, { user }) => {
    try {
      return await materialService.updateMaterial(args.id, args.material, user);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { materialQuery, materialMutation };
