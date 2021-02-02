const Closure = require('./closures.model');
const {
  CLOSURE_NOT_FOUND,
  CLOSURE_ALREADY_EXIST,
} = require('../../error-messages/closures.messages');
const uploadService = require('../upload/upload.service');

class ClosureService {
  async getAllClosure({ skip, limit }) {
    const items = await Closure.find()
      .skip(skip)
      .limit(limit);

    const count = await Closure.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getClosureById(id) {
    const foundClosure = await Closure.findById(id);
    if (foundClosure) {
      return foundClosure;
    }
    throw new Error(CLOSURE_NOT_FOUND);
  }

  async addClosure(data, upload) {
    if (upload) {
      const uploadImage = await uploadService.uploadFile(upload, ['large']);
      data.image = uploadImage.fileNames.large;
    }

    if (await this.checkClosureExist(data)) {
      throw new Error(CLOSURE_ALREADY_EXIST);
    }
    return await new Closure(data).save();
  }

  async updateClosure(id, closure, upload) {
    if (await this.checkClosureExist(closure)) {
      throw new Error(CLOSURE_ALREADY_EXIST);
    }
    if (upload) {
      const uploadImage = await uploadService.uploadFile(upload, ['large']);
      data.image = uploadImage.fileNames.large;
    }

    const closureMaterial = await Closure.findById(id);
    if (!closureMaterial) {
      throw new Error(CLOSURE_NOT_FOUND);
    }
    return await Closure.findByIdAndUpdate(id, closure, { new: true });
  }

  async deleteClosure(id) {
    const closure = await Closure.findByIdAndDelete(id);
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
    });
    return closureCount > 0;
  }
}

module.exports = new ClosureService();
