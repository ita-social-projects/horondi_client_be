const Closure = require('./closures.model');
const {
  CLOSURE_NOT_FOUND,
  CLOSURE_ALREADY_EXIST,
} = require('../../error-messages/closures.messages');
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
    MATERIAL,
    ADDITIONAL_PRICE,
    AVAILABLE,
    DEFAULT,
    FEATURES,
    COLOR,
    OPTION_TYPE,
    MODEL,
  },
} = require('../../consts/history-obj-keys');

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
    throw new Error(CLOSURE_NOT_FOUND);
  }

  async addClosure(data, upload, { _id: adminId }) {
    if (upload) {
      const uploadImage = await uploadService.uploadFile(upload, [LARGE]);
      data.image = uploadImage.fileNames.large;
    }

    if (await this.checkClosureExist(data)) {
      throw new Error(CLOSURE_ALREADY_EXIST);
    }
    const newClosure = await new Closure(data).save();

    const historyRecord = generateHistoryObject(
      ADD_CLOSURE,
      newClosure.model,
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
      newClosure.optionType,
      newClosure.features,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newClosure;
  }

  async updateClosure(id, closure, upload, { _id: adminId }) {
    if (await this.checkClosureExist(closure)) {
      throw new Error(CLOSURE_ALREADY_EXIST);
    }
    if (upload) {
      const uploadImage = await uploadService.uploadFile(upload, [LARGE]);
      data.image = uploadImage.fileNames.large;
    }

    const closureMaterial = await Closure.findById(id).exec();

    if (!closureMaterial) {
      throw new Error(CLOSURE_NOT_FOUND);
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
      '',
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
      throw new Error(CLOSURE_NOT_FOUND);
    }
    const historyRecord = generateHistoryObject(
      DELETE_CLOSURE,
      '',
      closure.name[UA].value,
      closure._id,
      generateHistoryChangesData(closure, [
        NAME,
        MATERIAL,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    await addHistoryRecord(historyRecord);
    return closure;
  }

  async checkClosureExist(data) {
    let closureCount = await Closure.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return closureCount > 0;
  }
}

module.exports = new ClosureService();
