const Pocket = require('./pocket.model');
const uploadService = require('../upload/upload.utils');
const RuleError = require('../../errors/rule.error');
const {
  POCKET_ALREADY_EXIST,
  POCKET_NOT_FOUND,
} = require('../../error-messages/pocket.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_POCKET, EDIT_POCKET, DELETE_POCKET },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/hisrory');
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
  async getAllPockets({ skip, limit }) {
    const items = await Pocket.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Pocket.find()
      .countDocuments()
      .exec();

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

  async getPocketsByModel(id) {
    const pocket = Pocket.find({ model: id }).exec();
    if (pocket.length === 0) {
      throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
    }
    return pocket;
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

    if (await this.checkIfPocketExist(pocket, id)) {
      throw new RuleError(POCKET_ALREADY_EXIST, BAD_REQUEST);
    }

    if (!image) {
      return await Pocket.findByIdAndUpdate(id, pocket, { new: true }).exec();
    }

    await uploadService.deleteFiles(image);

    const uploadImage = await uploadService.uploadSmallImage(image);
    pocket.image = uploadImage.fileNames.small;

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

    return await Pocket.findByIdAndUpdate(id, pocket, {
      new: true,
    }).exec();
  }

  async addPocket(pocket, image, { _id: adminId }) {
    if (await this.checkIfPocketExist(pocket)) {
      throw new RuleError(POCKET_ALREADY_EXIST, BAD_REQUEST);
    }

    if (image) {
      const uploadImage = await uploadService.uploadSmallImage(image);
      pocket.image = uploadImage.fileNames.small;
    }

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

  async checkIfPocketExist(data, id) {
    let pocketCount = await Pocket.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return pocketCount > 0;
  }
}

module.exports = new PocketService();
