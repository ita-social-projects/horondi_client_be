const Constructor = require('./constructor.model');
const uploadService = require('../upload/upload.service');
const {
  commonFiltersHandler,
} = require('../../utils/constructorOptionCommonFilters');
const RuleError = require('../../errors/rule.error');
const {
  CONSTRUCTOR_NOT_FOUND,
} = require('../../error-messages/constructor.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { CONSTRUCTOR_EVENT },
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
  HISTORY_OBJ_KEYS: { NAME, MODEL },
} = require('../../consts/history-obj-keys');

class ConstructorService {
  async getAllConstructors(limit, skip, filter) {
    const filterOptions = commonFiltersHandler(filter);

    const items = await Constructor.find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Constructor.countDocuments(filterOptions).exec();

    return {
      items,
      count,
    };
  }

  async getConstructorById(id) {
    const foundConstructor = await Constructor.findById(id).exec();

    if (!foundConstructor) {
      throw new RuleError(CONSTRUCTOR_NOT_FOUND, NOT_FOUND);
    }

    return foundConstructor;
  }

  async getConstructorByModel(id) {
    const foundConstructor = await Constructor.find({ model: id }).exec();

    if (!foundConstructor.length) {
      throw new RuleError(CONSTRUCTOR_NOT_FOUND, NOT_FOUND);
    }

    return foundConstructor;
  }

  async updateConstructor(id, constructor, image, { _id: adminId }) {
    const constructorToUpdate = await Constructor.findById(id).exec();

    if (!constructorToUpdate) {
      throw new RuleError(CONSTRUCTOR_NOT_FOUND, NOT_FOUND);
    }

    if (image) {
      if (constructorToUpdate.images) {
        const images = Object.values(constructorToUpdate.images).filter(
          (item) => typeof item === 'string' && item
        );
        await uploadService.deleteFiles(images);
      }

      const uploadImage = await uploadService.uploadFiles([image]);
      const imageResults = await uploadImage[0];

      constructor.images = imageResults.fileNames;
    }

    const updatedConstructor = await Constructor.findByIdAndUpdate(
      id,
      constructor,
      {
        new: true,
      }
    ).exec();

    const { beforeChanges, afterChanges } = getChanges(
      constructorToUpdate,
      constructor
    );
    const historyEvent = {
      action: EDIT_EVENT,
      historyName: CONSTRUCTOR_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      constructorToUpdate.model?._id,
      constructorToUpdate.name[UA].value,
      constructorToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return updatedConstructor;
  }

  async addConstructor(constructor, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);

      constructor.images = uploadImage.fileNames;
    }

    const newConstructor = await new Constructor(constructor).save();
    const historyEvent = {
      action: ADD_EVENT,
      historyName: CONSTRUCTOR_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      newConstructor.model?._id,
      newConstructor.name[UA].value,
      newConstructor._id,
      [],
      generateHistoryChangesData(newConstructor, [NAME, MODEL]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newConstructor;
  }

  async deleteConstructor(id, { _id: adminId }) {
    const foundConstructor = await Constructor.findById(id)
      .lean()
      .exec();

    if (!foundConstructor) {
      throw new RuleError(CONSTRUCTOR_NOT_FOUND, NOT_FOUND);
    }

    if (foundConstructor.images) {
      await uploadService.deleteFiles(Object.values(foundConstructor.images));
    }
    const historyEvent = {
      action: DELETE_EVENT,
      historyName: CONSTRUCTOR_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      foundConstructor.model,
      foundConstructor.name[UA].value,
      foundConstructor._id,
      generateHistoryChangesData(foundConstructor, [NAME, MODEL]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return Constructor.findByIdAndDelete(id);
  }
}

module.exports = new ConstructorService();
