const materialsService = require('./materials-page.service');

const materialsQuery = {
  getAllMaterialsBlocks: () => materialsService.getAllMaterialsBlocks(),
};

const materialsMutation = {
  addMaterialsBlock: (_, { materialsBlock }) => {
    materialsService.addMaterialsBlock(materialsBlock);
  },
  deleteMaterialsBlock: (_, { id }) =>
    materialsService.deleteMaterialsBlock(id),

  updateMaterialsBlock: (_, { id, materialsBlock }) => {
    materialsService.updateMaterialsBlock(id, materialsBlock);
  },
};

module.exports = { materialsQuery, materialsMutation };
