const Materials = require('./materials-page.model');
const {
  MATERIAL_NOT_FOUND,
} = require('../../error-messages/material.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { MATERIAL_ABOUT_EVENT },
} = require('../../consts/history-events');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  HISTORY_OBJ_KEYS: { TITLE, TYPE, TEXT },
} = require('../../consts/history-obj-keys');

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

  async addMaterialsBlock(materialsBlock, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);
      materialsBlock.image = uploadImage.fileNames;
    }

    materialsBlock.translationsKey = await addTranslations(
      createTranslations(materialsBlock)
    );

    const newMaterialsBlock = await new Materials(materialsBlock).save();

    const historyEvent = {
      action: ADD_EVENT,
      historyName: MATERIAL_ABOUT_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      '',
      newMaterialsBlock.title,
      newMaterialsBlock._id,
      [],
      generateHistoryChangesData(newMaterialsBlock, [TITLE, TYPE, TEXT]),
      adminId
    );
    await addHistoryRecord(historyRecord);

    return newMaterialsBlock;
  }

  async deleteMaterialsBlock(id, { _id: adminId }) {
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

    const historyEvent = {
      action: DELETE_EVENT,
      historyName: MATERIAL_ABOUT_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      '',
      materialsBlock.title,
      materialsBlock._id,
      generateHistoryChangesData(materialsBlock, [TITLE, TYPE, TEXT]),
      [],
      adminId
    );
    await addHistoryRecord(historyRecord);

    return materialsBlock;
  }

  async updateMaterialsBlock(id, materialsBlock, image, { _id: adminId }) {
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

    const { beforeChanges, afterChanges } = getChanges(
      foundMaterialsBlock,
      materialsBlock
    );

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

    const historyEvent = {
      action: EDIT_EVENT,
      historyName: MATERIAL_ABOUT_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      '',
      foundMaterialsBlock.title,
      foundMaterialsBlock._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    return updatedMaterialsBlock;
  }
}

module.exports = new MaterialsService();
