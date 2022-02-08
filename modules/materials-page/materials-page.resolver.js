const materialsService = require('./materials-page.service');

const materialsQuery = {
  getAllMaterialsBlocks: async (_, { skip, limit }) =>
    materialsService.getAllMaterialsBlocks(skip, limit),

  getMaterialsBlockById: async (_, { id }) =>
    materialsService.getMaterialsBlockById(id),

  getMaterialsBlocksByType: async (_, { type, skip, limit, filter }) =>
    materialsService.getMaterialsBlocksByType(type, skip, limit, filter),
};

const materialsMutation = {
  addMaterialsBlock: async (_, { materialsBlock }) =>
    materialsService.addMaterialsBlock(materialsBlock),

  deleteMaterialsBlock: async (_, { id }) =>
    materialsService.deleteMaterialsBlock(id),

  updateMaterialsBlock: async (_, { id, materialsBlock }) =>
    materialsService.updateMaterialsBlock(id, materialsBlock),
};

module.exports = { materialsQuery, materialsMutation };
