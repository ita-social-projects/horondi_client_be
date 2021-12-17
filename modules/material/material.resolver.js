const materialService = require('./material.service');
const RuleError = require('../../errors/rule.error');

const materialQuery = {
  getAllMaterials: async (parent, args) => materialService.getAllMaterials(args),
  getMaterialById: async (parent, args) => {
    try {
      return await materialService.getMaterialById(args.id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getMaterialsByPurpose: (parent, args) => materialService.getMaterialsByPurposes(args.purposes),
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
