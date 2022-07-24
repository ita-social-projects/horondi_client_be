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
const uploadService = require('../upload/upload.service');

class MaterialsService {
  async getAllMaterialsBlocks(skip, limit) {
    const items = await Materials.find({}).skip(skip).limit(limit).exec();

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

  async getMaterialsBlocksByType(type, skip, limit, filter) {
    const filterOptions = {};

    if (filter?.search) {
      const searchString = filter.search.trim();

      filterOptions.$or = [
        { title: { $regex: `${searchString}`, $options: 'i' } },
      ];
    }

    const items = await Materials.find({ type, ...filterOptions })
      .skip(skip)
      .limit(limit)
      .exec();

    const count = items?.length || 0;

    return {
      items,
      count,
    };
  }

  async addMaterialsBlock(materialsBlock, image) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);
      materialsBlock.image = uploadImage.fileNames;
    }

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

    if (materialsBlock.image) {
      await uploadService.deleteFiles(
        Object.values(materialsBlock.toObject().image).filter(
          item => typeof item === 'string' && item
        )
      );
    }

    await deleteTranslations(materialsBlock.translationsKey);

    return materialsBlock;
  }

  async updateMaterialsBlock(id, materialsBlock, image) {
    const foundMaterialsBlock = await this.getMaterialsBlockById(id);

    if (image) {
      if (foundMaterialsBlock.image) {
        const currentImage = foundMaterialsBlock.toObject().image;
        const currentImageList = Object.values(currentImage).filter(
          item => typeof item === 'string' && item
        );
        await uploadService.deleteFiles(currentImageList);
      }
      const uploadImage = await uploadService.uploadFile(image);
      materialsBlock.image = uploadImage.fileNames;
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
