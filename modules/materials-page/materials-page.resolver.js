const materialsService = require('./materials-page.service');

const materialsQuery = {
  getAllMaterialsBlocks: () => materialsService.getAllMaterialsBlocks(),
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
