const Basics = require('./basics.model');
const uploadService = require('../upload/upload.service');
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
const { BASICS_NOT_FOUND } = require('../../consts/basics-messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { BASIC_EVENT },
} = require('../../consts/history-events');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { NAME, ADDITIONAL_PRICE, AVAILABLE, FEATURES },
} = require('../../consts/history-obj-keys');

class BasicsService {
  async getAllBasics(limit, skip, filter) {
    const filterOptions = commonFiltersHandler(filter);

    if (filter?.material.length) {
      filterOptions['features.material'] = { $in: filter.material };
    }

    if (filter?.color.length) {
      filterOptions['features.color'] = { $in: filter.color };
    }

    const items = await Basics.find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Basics.countDocuments(filterOptions).exec();

    return {
      items,
      count,
    };
  }

  async getBasicById(id) {
    const foundBasic = await Basics.findById(id).exec();

    if (!foundBasic) {
      throw new RuleError(BASICS_NOT_FOUND, NOT_FOUND);
    }

    return foundBasic;
  }

  async updateBasic(id, basic, image, { _id: adminId }) {
    const basicToUpdate = await Basics.findById(id).exec();
    if (!basicToUpdate) {
      throw new RuleError(BASICS_NOT_FOUND, NOT_FOUND);
    }

    if (image) {
      if (basicToUpdate.images) {
        const images = Object.values(basicToUpdate.images).filter(
          item => typeof item === 'string' && item
        );
        await uploadService.deleteFiles(images);
      }

      const uploadImage = await uploadService.uploadFiles([image]);
      const imageResults = await uploadImage[0];
      basic.images = imageResults.fileNames;
    }

    const updatedBasic = await Basics.findByIdAndUpdate(id, basic, {
      new: true,
    }).exec();

    const { beforeChanges, afterChanges } = getChanges(basicToUpdate, basic);

    const historyEvent = {
      action: EDIT_EVENT,
      historyName: BASIC_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      basicToUpdate.model?._id,
      basicToUpdate.name[UA].value,
      basicToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    await updateTranslations(
      basicToUpdate.translationsKey,
      createTranslations(basic)
    );

    return updatedBasic;
  }

  async addBasic(basic, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);
      basic.images = uploadImage.fileNames;
    }

    basic.translationsKey = await addTranslations(createTranslations(basic));

    const newBasic = await new Basics(basic).save();

    const historyEvent = {
      action: ADD_EVENT,
      historyName: BASIC_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      newBasic.model?._id,
      newBasic.name[UA].value,
      newBasic._id,
      [],
      generateHistoryChangesData(newBasic, [
        NAME,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newBasic;
  }

  async deleteBasic(id, { _id: adminId }) {
    const foundBasic = await Basics.findById(id).lean().exec();

    if (!foundBasic) {
      throw new RuleError(BASICS_NOT_FOUND, NOT_FOUND);
    }

    if (foundBasic.images) {
      uploadService.deleteFiles(Object.values(foundBasic.images));
    }

    const historyEvent = {
      action: DELETE_EVENT,
      historyName: BASIC_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      foundBasic.model,
      foundBasic.name[UA].value,
      foundBasic._id,
      generateHistoryChangesData(foundBasic, [
        NAME,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    await deleteTranslations(foundBasic.translationsKey);

    return Basics.findByIdAndDelete(id);
  }
}

module.exports = new BasicsService();
