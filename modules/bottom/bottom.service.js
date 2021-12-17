const Bottom = require('./bottom.model');
const uploadService = require('../upload/upload.service');
const { calculateAdditionalPrice } = require('../currency/currency.utils');
const {
  commonFiltersHandler,
} = require('../../utils/constructorOptionCommonFilters');
const RuleError = require('../../errors/rule.error');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');
const { BOTTOM_NOT_FOUND } = require('../../error-messages/bottom-messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_BOTTOM, EDIT_BOTTOM, DELETE_BOTTOM },
} = require('../../consts/history-actions');
const {
  getChanges,
  generateHistoryChangesData,
  generateHistoryObject,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: {
    NAME,
    ADDITIONAL_PRICE,
    AVAILABLE,
    FEATURES,
    OPTION_TYPE,
  },
} = require('../../consts/history-obj-keys');

class BottomService {
  async getAllBottoms(limit, skip, filter) {
    const filterOptions = commonFiltersHandler(filter);

    const items = await Bottom.find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Bottom.countDocuments(filterOptions).exec();

    return {
      items,
      count,
    };
  }

  async getBottomById(id) {
    const foundBottom = await Bottom.findById(id).exec();

    if (!foundBottom) {
      throw new RuleError(BOTTOM_NOT_FOUND, NOT_FOUND);
    }

    return foundBottom;
  }

  async updateBottom(id, bottom, image, { _id: adminId }) {
    const bottomToUpdate = await Bottom.findById(id).exec();

    if (!bottomToUpdate) {
      throw new RuleError(BOTTOM_NOT_FOUND, NOT_FOUND);
    }

    if (image) {
      if (bottomToUpdate.images) {
        const images = Object.values(bottomToUpdate.images).filter(
          (item) => typeof item === 'string' && item,
        );
        await uploadService.deleteFiles(images);
      }

      const uploadImage = await uploadService.uploadFiles([image]);
      const imageResults = await uploadImage[0];
      bottom.images = imageResults.fileNames;
    }

    bottom.additionalPrice = await calculateAdditionalPrice(
      bottom.additionalPrice,
    );

    const updatedBottom = await Bottom.findByIdAndUpdate(id, bottom, {
      new: true,
    }).exec();

    const { beforeChanges, afterChanges } = getChanges(bottomToUpdate, bottom);

    const historyRecord = generateHistoryObject(
      EDIT_BOTTOM,
      bottomToUpdate.model?._id,
      bottomToUpdate.name[UA].value,
      bottomToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId,
    );

    await addHistoryRecord(historyRecord);

    await updateTranslations(
      bottomToUpdate.translationsKey,
      createTranslations(bottom),
    );

    return updatedBottom;
  }

  async deleteBottom(id, { _id: adminId }) {
    const foundBottom = await Bottom.findById(id)
      .lean()
      .exec();

    if (!foundBottom) {
      throw new RuleError(BOTTOM_NOT_FOUND, NOT_FOUND);
    }

    const historyRecord = generateHistoryObject(
      DELETE_BOTTOM,
      foundBottom.model?._id,
      foundBottom.name[UA].value,
      foundBottom._id,
      generateHistoryChangesData(foundBottom, [
        NAME,
        OPTION_TYPE,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      [],
      adminId,
    );

    await addHistoryRecord(historyRecord);

    await deleteTranslations(foundBottom.translationsKey);

    return Bottom.findByIdAndDelete(id);
  }

  async addBottom(bottom, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);
      bottom.images = uploadImage.fileNames;
    }

    bottom.additionalPrice = await calculateAdditionalPrice(
      bottom.additionalPrice,
    );

    bottom.translationsKey = await addTranslations(createTranslations(bottom));

    const newBottom = await new Bottom(bottom).save();

    const historyRecord = generateHistoryObject(
      ADD_BOTTOM,
      newBottom.model?._id,
      newBottom.name[UA].value,
      newBottom._id,
      [],
      generateHistoryChangesData(newBottom, [
        NAME,
        OPTION_TYPE,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      adminId,
    );

    await addHistoryRecord(historyRecord);

    return newBottom;
  }
}

module.exports = new BottomService();
