const Closure = require('./closures.model');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');
const RuleError = require('../../errors/rule.error');
const { CLOSURE_NOT_FOUND } = require('../../error-messages/closures.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const uploadService = require('../upload/upload.service');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { CLOSURE_EVENT },
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

class ClosureService {
  async getAllClosure(limit, skip, filter) {
    const filterOptions = {};

    if (filter?.search) {
      filterOptions['name.0.value'] = {
        $regex: `${filter.search.trim()}`,
        $options: 'i',
      };
    }
    const items = await Closure.find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Closure.countDocuments(filterOptions).exec();

    return {
      items,
      count,
    };
  }

  async getClosureById(id) {
    const foundClosure = await Closure.findById(id).exec();
    if (foundClosure) {
      return foundClosure;
    }
    throw new RuleError(CLOSURE_NOT_FOUND, NOT_FOUND);
  }

  async addClosure(closure, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadFile(image);
      closure.images = uploadImage.fileNames;
    }

    closure.translations_key = await addTranslations(
      createTranslations(closure)
    );
    const newClosure = await new Closure(closure).save();
    const historyEvent = {
      action: ADD_EVENT,
      historyName: CLOSURE_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      newClosure.model?._id,
      newClosure.name[UA].value,
      newClosure._id,
      [],
      generateHistoryChangesData(newClosure, [
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

    return newClosure;
  }

  async updateClosure(id, closure, image, { _id: adminId }) {
    const closureToUpdate = await Closure.findById(id).exec();

    if (!closureToUpdate) {
      throw new RuleError(CLOSURE_NOT_FOUND, NOT_FOUND);
    }

    await updateTranslations(
      closureToUpdate.translations_key,
      createTranslations(closure)
    );

    if (image) {
      if (closureToUpdate.images) {
        const images = Object.values(closureToUpdate.images).filter(
          item => typeof item === 'string' && item
        );
        await uploadService.deleteFiles(images);
      }

      const uploadImage = await uploadService.uploadFiles([image]);
      const imageResults = await uploadImage[0];
      closure.images = imageResults.fileNames;
    }

    const { beforeChanges, afterChanges } = getChanges(
      closureToUpdate,
      closure
    );
    const historyEvent = {
      action: EDIT_EVENT,
      historyName: CLOSURE_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      closureToUpdate.model?._id,
      closureToUpdate.name[UA].value,
      closureToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    const updatedClosure = await Closure.findByIdAndUpdate(id, closure, {
      new: true,
    }).exec();

    if (!updatedClosure) {
      throw new RuleError(CLOSURE_NOT_FOUND, NOT_FOUND);
    }

    return updatedClosure;
  }

  async deleteClosure(id, { _id: adminId }) {
    const closure = await Closure.findByIdAndDelete(id).exec();
    if (!closure) {
      throw new RuleError(CLOSURE_NOT_FOUND, NOT_FOUND);
    }
    const historyEvent = {
      action: DELETE_EVENT,
      historyName: CLOSURE_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      closure.model?._id,
      closure.name[UA].value,
      closure._id,
      generateHistoryChangesData(closure, [
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
    await deleteTranslations(closure.translations_key);
    await addHistoryRecord(historyRecord);

    return closure;
  }
}

module.exports = new ClosureService();
