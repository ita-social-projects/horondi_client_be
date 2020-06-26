const materialService = require('./material.service');

const materialQuery = {
  getAllMaterials: () => materialService.getAllMaterials(),
  getMaterialById: (parent, args) => materialService.getMaterialById(args.id),
};

const materialMutation = {
  addMaterial: (parent, args) => materialService.addMaterial(args.material),
  deleteMaterial: (parent, args) => materialService.deleteMaterial(args.id),
  updateMaterial: (parent, args) => materialService.updateMaterial(args.id, args.material),
};

module.exports = { materialQuery, materialMutation };
