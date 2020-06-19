const Material = require('./materials.service');

const MaterialQuery = {
  getAllMaterials: () => Material.getAllMaterials(),
  getMaterialById: (parent, args) => Material.getMaterialById(args.id),
};

module.exports = MaterialQuery;
