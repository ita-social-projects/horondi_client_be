const Materials = require('./materials-page.model');

class MaterialsService {
  async getAllMaterialsBlocks() {
    return Materials.find({}).exec();
  }

  async addMaterialsBlock(materialsBlock) {
    return new Materials(materialsBlock).save();
  }

  async deleteMaterialsBlock(id) {
    const materialsBlock = await Materials.findByIdAndDelete(id);

    if (materialsBlock) {
      return materialsBlock;
    }
  }

  async updateMaterialsBlock(id, materialsBlock) {
    return Materials.findByIdAndUpdate(id, materialsBlock, {
      new: true,
    }).exec();
  }
}

module.exports = new MaterialsService();
