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
  addMaterialsBlock: async (_, { materialsBlock, image }) =>
    materialsService.addMaterialsBlock(materialsBlock, image),

  deleteMaterialsBlock: async (_, { id }) =>
    materialsService.deleteMaterialsBlock(id),

  updateMaterialsBlock: async (_, { id, materialsBlock, image }) =>
    materialsService.updateMaterialsBlock(id, materialsBlock, image),
};

module.exports = { materialsQuery, materialsMutation };
