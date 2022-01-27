const Materials = require('./materials-page.model');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class MaterialsService {
  async getAllMaterialsBlocks() {
    return Materials.find({}).exec();
  }

  async addMaterialsBlock(materialsBlock) {
    materialsBlock.translationsKey = await addTranslations(
      createTranslations(materialsBlock)
    );

    return new Materials(materialsBlock).save();
  }

  async deleteMaterialsBlock(id) {
    const materialsBlock = await Materials.findByIdAndDelete(id);

    if (materialsBlock) {
      await deleteTranslations(materialsBlock.translationsKey);

      return materialsBlock;
    }
  }

  async updateMaterialsBlock(id, materialsBlock) {
    const foundMaterialsBlock = await Materials.findById(id).exec();

    await updateTranslations(
      foundMaterialsBlock.translationsKey,
      createTranslations(materialsBlock)
    );

    const updatedMaterialsBlock = await Materials.findByIdAndUpdate(
      id,
      materialsBlock,
      { new: true }
    ).exec();

    return updatedMaterialsBlock || null;
  }
}

module.exports = new MaterialsService();
