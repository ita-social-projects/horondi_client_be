const Strap = require('./strap.model');
const RuleError = require('../../errors/rule.error');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');
const uploadService = require('../upload/upload.service');
const { uploadSmallImage } = require('../upload/upload.utils');
const {
  commonFiltersHandler,
} = require('../../utils/constructorOptionCommonFilters');
const { STRAP_NOT_FOUND } = require('../../error-messages/strap.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { STRAP_EVENT },
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
  HISTORY_OBJ_KEYS: {
    NAME,
    ADDITIONAL_PRICE,
    AVAILABLE,
    FEATURES,
    OPTION_TYPE,
    MODEL,
  },
} = require('../../consts/history-obj-keys');

class StrapService {
  async getAllStraps(limit, skip, filter) {
    const filterOptions = commonFiltersHandler(filter);

    if (filter?.color?.length) {
      filterOptions['features.color'] = { $in: filter.color };
    }

    const items = await Strap.find(filterOptions)
      .populate('features.color')
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Strap.countDocuments(filterOptions).exec();

    return {
      items,
      count,
    };
  }

  async getStrapById(id) {
    const foundStrap = await Strap.findById(id).exec();

    if (foundStrap) {
      return foundStrap;
    }
    throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
  }

  async deleteStrap(id, { _id: adminId }) {
    const foundStrap = await Strap.findByIdAndDelete(id).lean().exec();

    if (!foundStrap) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }

    if (foundStrap.image) {
      await uploadService.deleteFiles([foundStrap.image]);
    }
    const historyEvent = {
      action: DELETE_EVENT,
      historyName: STRAP_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      foundStrap.model,
      foundStrap.name[UA].value,
      foundStrap._id,
      generateHistoryChangesData(foundStrap, [
        NAME,
        OPTION_TYPE,
        MODEL,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    await deleteTranslations(foundStrap.translationsKey);

    return foundStrap;
  }

  async updateStrap(id, strap, image, { _id: adminId }) {
    const strapToUpdate = await Strap.findById(id).exec();

    if (!strapToUpdate) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }

    await uploadService.deleteFiles([strap.image]);

    if (image) {
      strap.image = await uploadSmallImage(image);
    }

    const { beforeChanges, afterChanges } = getChanges(strapToUpdate, strap);
    const historyEvent = {
      action: EDIT_EVENT,
      historyName: STRAP_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      strapToUpdate.model?._id,
      strapToUpdate.name[UA].value,
      strapToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    await updateTranslations(
      strapToUpdate.translationsKey,
      createTranslations(strap)
    );

    return Strap.findByIdAndUpdate(id, strap, { new: true }).exec();
  }

  async addStrap(strap, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);
      strap.images = uploadImage.fileNames;
    }

    strap.translationsKey = await addTranslations(createTranslations(strap));

    const newStrap = await new Strap(strap).save();
    const historyEvent = {
      action: ADD_EVENT,
      historyName: STRAP_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      newStrap.model?._id,
      newStrap.name[UA].value,
      newStrap._id,
      [],
      generateHistoryChangesData(newStrap, [
        NAME,
        OPTION_TYPE,
        MODEL,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newStrap;
  }
}

module.exports = new StrapService();
