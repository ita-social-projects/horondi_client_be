const Closure = require('./closures.model');
const RuleError = require('../../errors/rule.error');
const {
  CLOSURE_NOT_FOUND,
  CLOSURE_ALREADY_EXIST,
} = require('../../error-messages/closures.messages');
const { calculatePrice } = require('../currency/currency.utils');
const { checkIfItemExist } = require('../../utils/exist-checker');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const uploadService = require('../upload/upload.service');
const {
  FILE_SIZES: { LARGE },
} = require('../../consts/file-sizes');
const {
  HISTORY_ACTIONS: { ADD_CLOSURE, DELETE_CLOSURE, EDIT_CLOSURE },
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
const { check } = require('prettier');

class ClosureService {
  async getAllClosure({ skip, limit }) {
    const items = await Closure.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Closure.find()
      .countDocuments()
      .exec();
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

  async addClosure(data, upload, { _id: adminId }) {
    if (upload) {
      const uploadImage = await uploadService.uploadFile(upload, [LARGE]);
      data.image = uploadImage.fileNames.large;
    }

    const checkResult = await checkIfItemExist(data, Closure);

    if (checkResult) {
      throw new RuleError(CLOSURE_ALREADY_EXIST, BAD_REQUEST);
    }

    if (data.additionalPrice) {
      data.additionalPrice = await calculatePrice(data.additionalPrice);
    }

    const newClosure = await new Closure(data).save();

    const historyRecord = generateHistoryObject(
      ADD_CLOSURE,
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

  async updateClosure(id, closure, upload, { _id: adminId }) {
    const checkResult = await checkIfItemExist(closure, Closure);

    if (checkResult) {
      throw new RuleError(CLOSURE_ALREADY_EXIST, BAD_REQUEST);
    }
    if (upload) {
      const uploadImage = await uploadService.uploadFile(upload, [LARGE]);
      data.image = uploadImage.fileNames.large;
    }

    const closureMaterial = await Closure.findById(id).exec();

    if (!closureMaterial) {
      throw new RuleError(CLOSURE_NOT_FOUND, NOT_FOUND);
    }

    if (closure.additionalPrice) {
      closure.additionalPrice = await calculatePrice(closure.additionalPrice);
    }

    const updatedClosure = await Closure.findByIdAndUpdate(id, closure, {
      new: true,
    }).exec();

    const { beforeChanges, afterChanges } = getChanges(
      closureMaterial,
      closure
    );

    const historyRecord = generateHistoryObject(
      EDIT_CLOSURE,
      closureMaterial.model?._id,
      closureMaterial.name[UA].value,
      closureMaterial._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    return updatedClosure;
  }

  async deleteClosure(id, { _id: adminId }) {
    const closure = await Closure.findByIdAndDelete(id).exec();
    if (!closure) {
      throw new RuleError(CLOSURE_NOT_FOUND, NOT_FOUND);
    }
    const historyRecord = generateHistoryObject(
      DELETE_CLOSURE,
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

    await addHistoryRecord(historyRecord);

    return closure;
  }
}

module.exports = new ClosureService();
