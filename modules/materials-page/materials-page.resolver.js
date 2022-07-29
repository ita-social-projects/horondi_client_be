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
  addMaterialsBlock: async (_, { materialsBlock, image }, { user }) =>
    materialsService.addMaterialsBlock(materialsBlock, image, user),

  deleteMaterialsBlock: async (_, { id }, { user }) =>
    materialsService.deleteMaterialsBlock(id, user),

  updateMaterialsBlock: async (_, { id, materialsBlock, image }, { user }) =>
    materialsService.updateMaterialsBlock(id, materialsBlock, image, user),
};

module.exports = { materialsQuery, materialsMutation };
