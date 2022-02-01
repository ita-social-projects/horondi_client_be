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
  async getAllMaterialsBlocks(skip, limit) {
    const items = await Materials.find({})
      .skip(skip)
      .limit(limit)
      .exec();

    const count = items?.length || 0;

    return {
      items,
      count,
    };
  }

  async getMaterialsBlockById(id) {
    const materialsBlock = await Materials.findById(id).exec();

    if (!materialsBlock) {
      throw new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);
    }

    return materialsBlock;
  }

  async addMaterialsBlock(materialsBlock) {
    materialsBlock.translationsKey = await addTranslations(
      createTranslations(materialsBlock)
    );

    return new Materials(materialsBlock).save();
  }

  async deleteMaterialsBlock(id) {
    const materialsBlock = await Materials.findByIdAndDelete(id).exec();

    if (!materialsBlock) {
      throw new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);
    }

    await deleteTranslations(materialsBlock.translationsKey);

    return materialsBlock;
  }

  async updateMaterialsBlock(id, materialsBlock) {
    const foundMaterialsBlock = await this.getMaterialsBlockById(id);

    if (!foundMaterialsBlock) {
      throw new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);
    }

    await updateTranslations(
      foundMaterialsBlock.translationsKey,
      createTranslations(materialsBlock)
    );

    const updatedMaterialsBlock = await Materials.findByIdAndUpdate(
      id,
      materialsBlock,
      { new: true }
    ).exec();

    if (!updatedMaterialsBlock) {
      throw new RuleError(MATERIAL_NOT_FOUND, NOT_FOUND);
    }

    return updatedMaterialsBlock;
  }
}

module.exports = new MaterialsService();
