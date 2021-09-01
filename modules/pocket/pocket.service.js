const Pocket = require('./pocket.model');
const uploadService = require('../upload/upload.service');
const { calculatePrice } = require('../currency/currency.utils');
const RuleError = require('../../errors/rule.error');
const { POCKET_NOT_FOUND } = require('../../error-messages/pocket.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_POCKET, EDIT_POCKET, DELETE_POCKET },
} = require('../../consts/history-actions');
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

class PocketService {
  async getAllPockets(limit, skip, filter) {
    const filterOptions = {};

    if (filter?.search) {
      filterOptions['name.0.value'] = {
        $regex: `${filter.search.trim()}`,
        $options: 'i',
      };
    }

    const items = await Pocket.find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Pocket.countDocuments(filterOptions).exec();

    return {
      items,
      count,
    };
  }

  async getPocketById(id) {
    const foundPocket = await Pocket.findById(id).exec();
    if (foundPocket) {
      return foundPocket;
    }
    throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
  }

  async deletePocket(id, { _id: adminId }) {
    const foundPocket = await Pocket.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundPocket) {
      throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
    }

    const historyRecord = generateHistoryObject(
      DELETE_POCKET,
      foundPocket.model,
      foundPocket.name[UA].value,
      foundPocket._id,
      generateHistoryChangesData(foundPocket, [
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

    return foundPocket;
  }

  async updatePocket(id, pocket, image, { _id: adminId }) {
    const pocketToUpdate = await Pocket.findById(id).exec();

    if (!pocketToUpdate) {
      throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
    }

    pocket.additionalPrice = await calculatePrice(pocket.additionalPrice);

    if (image) {
      if (pocketToUpdate.images) {
        const images = Object.values(pocketToUpdate.images).filter(
          item => typeof item === 'string' && item
        );
        await uploadService.deleteFiles(images);
      }
      const uploadResult = await uploadService.uploadFiles([image]);
      const imageResults = await uploadResult[0];
      pocket.images = imageResults.fileNames;
    }

    const { beforeChanges, afterChanges } = getChanges(pocketToUpdate, pocket);

    const historyRecord = generateHistoryObject(
      EDIT_POCKET,
      pocketToUpdate.model?._id,
      pocketToUpdate.name[UA].value,
      pocketToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return Pocket.findByIdAndUpdate(id, pocket, {
      new: true,
    }).exec();
  }

  async addPocket(pocket, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);
      pocket.images = uploadImage.fileNames;
    }

    pocket.additionalPrice = await calculatePrice(pocket.additionalPrice);

    const newPocket = await new Pocket(pocket).save();

    const historyRecord = generateHistoryObject(
      ADD_POCKET,
      newPocket.model?._id,
      newPocket.name[UA].value,
      newPocket._id,
      [],
      generateHistoryChangesData(newPocket, [
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

    return newPocket;
  }
}

module.exports = new PocketService();
