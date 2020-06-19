const Material = require('./materials.service');

const MaterialQuery = {
  getAllMaterials: () => Material.getAllMaterials(),
  getMaterialById: (parent, args) => Material.getMaterialById(args.id),
};

const MaterialMutation = {
  addMaterial: (parent, args) => Material.addMaterial(args.material),
  deleteMaterial: (parent, args) => Material.deleteMaterial(args.id),
};

module.exports = { MaterialQuery, MaterialMutation };
