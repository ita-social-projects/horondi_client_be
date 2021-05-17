const Size = require('./size.model');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const { calculatePrice } = require('../currency/currency.utils');
const {
  SIZES_NOT_FOUND,
  SIZE_NOT_FOUND,
} = require('../../error-messages/size.messages');
const {
  HISTORY_ACTIONS: { ADD_SIZE, DELETE_SIZE, EDIT_SIZE },
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
    AVAILABLE,
    SIMPLE_NAME,
    HEIGHT_IN_CM,
    WEIGHT_IN_KG,
    WIDTH_IN_CM,
    ADDITIONAL_PRICE,
    DEPTH_IN_CM,
    VOLUME_IN_LITERS,
  },
} = require('../../consts/history-obj-keys');
class SizeService {
  async getAllSizes(limit, skip, filter) {
    const filterOptions = {};

    if (filter?.name?.length) {
      filterOptions.name = { $in: filter.name };
    }
    if (filter?.available?.length) {
      filterOptions.available = { $in: filter.available };
    }
    if (filter?.searchBySimpleName) {
      const search = filter.searchBySimpleName.trim();

      filterOptions['simpleName.value'] = {
        $regex: `${search}`,
        $options: 'i',
      };
    }
    const items = await Size.find(filterOptions)
      .limit(limit)
      .skip(skip)
      .exec();

    const count = await Size.find(filterOptions)
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getSizeById(id) {
    const size = await Size.findById(id).exec();
    if (size) {
      return size;
    }
    throw new Error(SIZES_NOT_FOUND);
  }

  async addSize(sizeData, { _id: adminId }) {
    sizeData.additionalPrice = await calculatePrice(sizeData.additionalPrice);
    const newSize = await new Size(sizeData).save();

    const historyRecord = generateHistoryObject(
      ADD_SIZE,
      newSize.name,
      newSize.simpleName[UA].value,
      newSize._id,
      [],
      generateHistoryChangesData(newSize, [
        NAME,
        AVAILABLE,
        SIMPLE_NAME,
        HEIGHT_IN_CM,
        WEIGHT_IN_KG,
        WIDTH_IN_CM,
        ADDITIONAL_PRICE,
        DEPTH_IN_CM,
        VOLUME_IN_LITERS,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newSize;
  }

  async deleteSize(id, { _id: adminId }) {
    const foundSize = await Size.findByIdAndDelete(id)
      .lean()
      .exec();
    if (!foundSize) {
      throw new Error(SIZE_NOT_FOUND);
    }
    const historyRecord = generateHistoryObject(
      DELETE_SIZE,
      foundSize.name,
      foundSize.simpleName[UA].value,
      foundSize._id,
      generateHistoryChangesData(foundSize, [
        NAME,
        AVAILABLE,
        SIMPLE_NAME,
        HEIGHT_IN_CM,
        WEIGHT_IN_KG,
        WIDTH_IN_CM,
        ADDITIONAL_PRICE,
        DEPTH_IN_CM,
        VOLUME_IN_LITERS,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);
    return foundSize;
  }

  async updateSize(id, input, { _id: adminId }) {
    const sizeToUpdate = await Size.findById(id)
      .lean()
      .exec();

    if (!sizeToUpdate) {
      throw new Error(SIZE_NOT_FOUND);
    }
    input.additionalPrice = await calculatePrice(input.additionalPrice);

    const updatedSize = await Size.findByIdAndUpdate(id, input).exec();

    const { beforeChanges, afterChanges } = getChanges(sizeToUpdate, input);

    const historyRecord = generateHistoryObject(
      EDIT_SIZE,
      sizeToUpdate.name,
      sizeToUpdate.simpleName[UA].value,
      sizeToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    return updatedSize;
  }
}

module.exports = new SizeService();
