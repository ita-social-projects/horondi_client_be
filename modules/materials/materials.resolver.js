const Material = require('./materials.service');

const materialQuery = {
  getAllMaterials: () => Material.getAllMaterials(),
  getMaterialById: (parent, args) => Material.getMaterialById(args.id),
};

const materialMutation = {
  addMaterial: (parent, args) => Material.addMaterial(args.material),
  deleteMaterial: (parent, args) => Material.deleteMaterial(args.id),
};

module.exports = { materialQuery, materialMutation };
