const materialService = require('./material.service');
const RuleError = require('../../errors/rule.error');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');

const materialQuery = {
  getAllMaterials: async (parent, args) => {
    try {
      return await materialService.getAllMaterials(args);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getMaterialById: async (parent, args) => {
    try {
      const material = await materialService.getMaterialById(args.id);
      if (material) {
        return material;
      }
    } catch (e) {
      return new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);
    }
  },
  getMaterialsByPurpose: async (parent, args) => {
    try {
      return await materialService.getMaterialsByPurposes(args.purposes);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
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
