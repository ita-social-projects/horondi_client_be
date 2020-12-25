const Closure = require('./closure.model');
const {
  CLOSURE_NOT_FOUND,
  CLOSURE_ALREADY_EXIST,
} = require('../../error-messages/closure.messages');

class ClosureService {
  async getAllClosures({ skip, limit }) {
    const items = await Closure.find()
      .populate('material')
      .skip(skip)
      .limit(limit);

    const count = await Closure.find().countDocuments();
    return {
      items,
      count,
    };
  }

  async getClosureById(id) {
    const found = await Closure.findById(id).populate('material');
    if (found) {
      return found;
    }
    throw new Error(CLOSURE_NOT_FOUND);
  }

  async addClosure(data) {
    if (await this.checkClosureExist(data)) {
      throw new Error(CLOSURE_ALREADY_EXIST);
    }
    return await new Closure(data).save();
  }

  async updateClosure({ id, closure }) {
    const closure = await Closure.findById(id).populate('material');
    if (!closure) {
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
