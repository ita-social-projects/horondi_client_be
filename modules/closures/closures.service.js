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
const { generateHistoryObject, getChanges } = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');

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

  async addClosure(data, upload) {
    if (upload) {
      const uploadImage = await uploadService.uploadFile(upload, [LARGE]);
      data.image = uploadImage.fileNames.large;
    }

    if (await this.checkClosureExist(data)) {
      throw new Error(CLOSURE_ALREADY_EXIST);
    }
    const newClosure = await new Closure(data).save();

    const historyRecord = generateHistoryObject(ADD_CLOSURE);

    await addHistoryRecord();

    return newClosure;
  }

  async updateClosure(id, closure, upload) {
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
    return await Closure.findByIdAndUpdate(id, closure, { new: true }).exec();
  }

  async deleteClosure(id) {
    const closure = await Closure.findByIdAndDelete(id).exec();
    if (!closure) {
      throw new Error(CLOSURE_NOT_FOUND);
    }
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
