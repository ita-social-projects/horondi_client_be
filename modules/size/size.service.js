const mongoose = require('mongoose');
const _ = require('lodash');
const Size = require('./size.model');
const Model = require('../model/model.model');
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
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
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
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const RuleError = require('../../errors/rule.error');

class SizeService {
  async getAllSizes(limit, skip = 0, filter = {}) {
    const filterOptions = {};
    const items = [];

    if (filter?.name?.length) {
      filterOptions.name = { $in: filter.name };
    }
    if (filter?.available?.length) {
      filterOptions.available = { $in: filter.available };
    }

    const records = await Size.find(filterOptions)
      .populate('modelId')
      .skip(skip)
      .limit(limit)
      .exec();

    if (filter?.searchBySimpleName) {
      const search = filter.searchBySimpleName.trim();
      const regExCondition = new RegExp(search.trim(), 'i');

      if (limit) {
        items.push(
          ..._.take(
            _.drop(
              _.filter(records, record =>
                regExCondition.test(record.modelId.name[0].value)
              ),
              skip
            ),
            limit
          )
        );
      } else {
        items.push(
          _.filter(records, record =>
            regExCondition.test(record.modelId.name[0].value)
          )
        );
      }
    } else {
      items.push(...records);
    }

    const count = await Size.find(filterOptions)
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getSizeById(id) {
    const size = await Size.findById(id)
      .populate('modelId')
      .exec();

    if (size) {
      return size;
    }
    throw new RuleError(SIZES_NOT_FOUND, NOT_FOUND);
  }

  async addSize(sizeData, { _id: adminId }) {
    sizeData.additionalPrice = await calculatePrice(sizeData.additionalPrice);
    const newSize = await new Size(sizeData).save();
    const foundModel = await Model.findByIdAndUpdate(sizeData.modelId, {
      $push: { sizes: newSize._id },
    }).exec();

    const historyRecord = generateHistoryObject(
      ADD_SIZE,
      newSize.name,
      foundModel.name[0].value,
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
      throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);
    }
    const foundModel = await Model.findByIdAndUpdate(foundSize.modelId, {
      $pull: { sizes: id },
    }).exec();
    const historyRecord = generateHistoryObject(
      DELETE_SIZE,
      foundSize.name,
      foundModel.name[0].value,
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
    const modelToUpdate = await Model.findById(input.modelId)
      .lean()
      .exec();

    input.modelId = mongoose.Types.ObjectId(input.modelId);

    if (!sizeToUpdate) {
      throw new RuleError(SIZE_NOT_FOUND, NOT_FOUND);
    }
    if (!modelToUpdate) {
      throw new RuleError();
    }

    input.additionalPrice = await calculatePrice(input.additionalPrice);
    if (
      JSON.stringify(sizeToUpdate.modelId) !== JSON.stringify(input.modelId)
    ) {
      await Model.findByIdAndUpdate(sizeToUpdate.modelId, {
        $pull: { sizes: id },
      });

      await Model.findByIdAndUpdate(input.modelId, {
        $push: {
          sizes: id,
        },
      });
    }
    const updatedSize = await Size.findByIdAndUpdate(id, input).exec();

    const { beforeChanges, afterChanges } = getChanges(sizeToUpdate, input);

    const historyRecord = generateHistoryObject(
      EDIT_SIZE,
      sizeToUpdate.name,
      modelToUpdate.name[0].value,
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
