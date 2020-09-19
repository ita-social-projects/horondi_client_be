const Pattern = require('./pattern.model');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
} = require('../../error-messages/pattern.messages');

class PatternsService {
  async getAllPatterns({ skip, limit }) {
    const items = await Pattern.find()
      .skip(skip)
      .limit(limit);
    const count = await Pattern.find().countDocuments();

    return {
      items,
      count,
    };
  }

  async getPatternById(id) {
    const foundPattern = await Pattern.findById(id);
    if (foundPattern) {
      return foundPattern;
    }
    throw new Error(PATTERN_NOT_FOUND);
  }

  async updatePattern(id, pattern) {
    const patternToUpdate = await Pattern.findById(id);
    if (!patternToUpdate) {
      throw new Error(PATTERN_NOT_FOUND);
    }
    if (await this.checkPatternExist(pattern, id)) {
      throw new Error(PATTERN_ALREADY_EXIST);
    }
    return await Pattern.findByIdAndUpdate(id, pattern, {
      new: true,
    });
  }

  async addPattern(data) {
    if (await this.checkPatternExist(data)) {
      throw new Error(PATTERN_ALREADY_EXIST);
    }
    return new Pattern(data).save();
  }

  async deletePattern(id) {
    const foundPattern = await Pattern.findByIdAndDelete(id);
    if (foundPattern) {
      return foundPattern;
    }
    throw new Error(PATTERN_NOT_FOUND);
  }

  async checkPatternExist(data, id) {
    const patternsCount = await Pattern.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return patternsCount > 0;
  }
}
module.exports = new PatternsService();
