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
  async getAllSizes(limit = 0, skip = 0, filter = {}) {
    const filterOptions = {};
    const modelOptions = {};

    if (filter?.name?.length) {
      filterOptions.name = { $in: filter.name };
    }
    if (filter?.available?.length) {
      filterOptions.available = { $in: filter.available };
    }

    const records = await Size.find(filterOptions)
      .populate('modelId')
      .exec();

    if (filter?.searchBySimpleName) {
      const search = filter.searchBySimpleName.trim();

      modelOptions.regExp = new RegExp(search.trim(), 'i');
    }

    const items = _.take(
      _.drop(
        filter?.searchBySimpleName
          ? _.filter(records, record =>
              modelOptions?.regExp.test(record.modelId.name[0].value)
            )
          : records,
        skip
      ),
      limit
    );

    const count = _.filter(records, record => record.modelId).length;

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
    throw new Error(SIZES_NOT_FOUND);
  }

  async addSize(sizeData, { _id: adminId }) {
    console.log('sizedata', sizeData);
    sizeData.additionalPrice = await calculatePrice(sizeData.additionalPrice);
    const newSize = await new Size(sizeData).save();
    await Model.findByIdAndUpdate(sizeData.modelId, {
      $push: { sizes: newSize._id },
    });
    console.log(newSize);
    // const historyRecord = generateHistoryObject(
    //   ADD_SIZE,
    //   newSize.name,
    //   newSize.simpleName[UA].value,
    //   newSize._id,
    //   [],
    //   generateHistoryChangesData(newSize, [
    //     NAME,
    //     AVAILABLE,
    //     SIMPLE_NAME,
    //     HEIGHT_IN_CM,
    //     WEIGHT_IN_KG,
    //     WIDTH_IN_CM,
    //     ADDITIONAL_PRICE,
    //     DEPTH_IN_CM,
    //     VOLUME_IN_LITERS,
    //   ]),
    //   adminId
    // );
    // console.log(newSize);
    // await addHistoryRecord(historyRecord);

    return newSize;
  }

  async deleteSize(id, { _id: adminId }) {
    const foundSize = await Size.findByIdAndDelete(id)
      .lean()
      .exec();
    console.log(id, foundSize);
    if (!foundSize) {
      throw new Error(SIZE_NOT_FOUND);
    }
    // const historyRecord = generateHistoryObject(
    //   DELETE_SIZE,
    //   foundSize.name,
    //   foundSize.simpleName[UA].value,
    //   foundSize._id,
    //   generateHistoryChangesData(foundSize, [
    //     NAME,
    //     AVAILABLE,
    //     SIMPLE_NAME,
    //     HEIGHT_IN_CM,
    //     WEIGHT_IN_KG,
    //     WIDTH_IN_CM,
    //     ADDITIONAL_PRICE,
    //     DEPTH_IN_CM,
    //     VOLUME_IN_LITERS,
    //   ]),
    //   [],
    //   adminId
    // );

    // await addHistoryRecord(historyRecord);
    return foundSize;
  }

  async updateSize(id, input, { _id: adminId }) {
    console.log('update input', input);
    const sizeToUpdate = await Size.findById(id)
      .lean()
      .exec();
    const modelToUpdate = await Model.findById(input.modelId)
      .lean()
      .exec();
    input.modelId = mongoose.Types.ObjectId(input.modelId);

    console.log(id, sizeToUpdate);
    if (!sizeToUpdate) {
      throw new Error(SIZE_NOT_FOUND);
    }
    if (!modelToUpdate) {
      throw new Error();
    }
    input.additionalPrice = await calculatePrice(input.additionalPrice);

    const updatedSize = await Size.findByIdAndUpdate(id, input).exec();
    const updatedModel = await Model.findByIdAndUpdate(input.modelId, {
      $push: { sizes: id },
    });
    console.log(updatedModel);
    const { beforeChanges, afterChanges } = getChanges(sizeToUpdate, input);

    // const historyRecord = generateHistoryObject(
    //   EDIT_SIZE,
    //   sizeToUpdate.name,
    //   sizeToUpdate.simpleName[UA].value,
    //   sizeToUpdate._id,
    //   beforeChanges,
    //   afterChanges,
    //   adminId
    // );
    // await addHistoryRecord(historyRecord);

    return updatedSize;
  }
}

module.exports = new SizeService();
