const Strap = require('./strap.model');
const RuleError = require('../../errors/rule.error');
const {
  STRAP_NOT_FOUND,
  STRAP_ALREADY_EXIST,
} = require('../../error-messages/strap.messages');
const {
  STATUS_CODES: { BAD_REQUEST, NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_STRAP, EDIT_STRAP, DELETE_STRAP },
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

class StrapService {
  async getAllStraps({ skip, limit }) {
    const items = await Strap.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Strap.find()
      .countDocuments()
      .exec();

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

  async getStrapsByModel(id) {
    const strap = Strap.find({ model: id }).exec();
    if (strap.length === 0) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }
    return strap;
  }

  async deleteStrap(id, { _id: adminId }) {
    const foundStrap = await Strap.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundStrap) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }

    await uploadService.deleteFiles(Object.values(foundStrap.image));

    const historyRecord = generateHistoryObject(
      DELETE_STRAP,
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

    return foundStrap;
  }

  async updateStrap(id, strap, image, { _id: adminId }) {
    const strapToUpdate = await Strap.findById(id).exec();
    if (!strapToUpdate) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }

    if (await this.checkIfStrapExist(strap, id)) {
      throw new RuleError(STRAP_ALREADY_EXIST, BAD_REQUEST);
    }

    if (!image) {
      return await Strap.findByIdAndUpdate(id, strap, { new: true }).exec();
    }

    await uploadService.deleteFiles(image);

    const uploadImage = await uploadService.uploadSmallImage(image);
    strap.image = uploadImage.fileNames.small;

    const { beforeChanges, afterChanges } = getChanges(strapToUpdate, strap);

    const historyRecord = generateHistoryObject(
      EDIT_STRAP,
      strapToUpdate.model?._id,
      strapToUpdate.name[UA].value,
      strapToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return await Strap.findByIdAndUpdate(id, strap).exec();
  }

  async addStrap(strap, image, { _id: adminId }) {
    if (await this.checkIfStrapExist(strap)) {
      throw new RuleError(STRAP_ALREADY_EXIST, BAD_REQUEST);
    }

    if (image) {
      const uploadImage = await uploadService.uploadSmallImage(image);
      strap.image = uploadImage.fileNames.small;
    }
    const newStrap = await new Strap(strap).save();

    const historyRecord = generateHistoryObject(
      ADD_STRAP,
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

  async checkIfStrapExist(data, id) {
    let strapCount = await Strap.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return strapCount > 0;
  }
}

module.exports = new StrapService();
