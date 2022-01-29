const Materials = require('./materials-page.model');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

class MaterialsService {
  async getAllMaterialsBlocks() {
    const items = await Materials.find({}).exec();
    const count = items.length;

    return {
      items,
      count,
    };
  }

  async getMaterialsBlockById(id) {
    const materialsBlock = await Materials.findById(id).exec();

    if (!materialsBlock) throw new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);

    return materialsBlock;
  }

  async addMaterialsBlock(materialsBlock) {
    materialsBlock.translationsKey = await addTranslations(
      createTranslations(materialsBlock)
    );

    return new Materials(materialsBlock).save();
  }

  async deleteMaterialsBlock(id) {
    const materialsBlock = Materials.findByIdAndDelete(id);

    if (materialsBlock) {
      await deleteTranslations(materialsBlock.translationsKey);

      return materialsBlock;
    }
    return false;
  }

  async updateMaterialsBlock(id, materialsBlock) {
    const foundMaterialsBlock = await Materials.findById(id).exec();

    if (foundMaterialsBlock) {
      await updateTranslations(
        foundMaterialsBlock.translationsKey,
        createTranslations(materialsBlock)
      );
    } else {
      throw new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);
    }

    const updatedMaterialsBlock = await Materials.findByIdAndUpdate(
      id,
      materialsBlock,
      { new: true }
    ).exec();

    if (updatedMaterialsBlock) {
      return updatedMaterialsBlock;
    }
    return false;
  }
}

module.exports = new MaterialsService();
