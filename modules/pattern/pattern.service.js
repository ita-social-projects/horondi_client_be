const Pattern = require('./pattern.model');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
} = require('../../error-messages/pattern.messages');

class PatternsService {
  async getAllPatterns() {
    return await Pattern.find();
  }

  async getPatternById(id) {
    const foundPattern = await Pattern.findById(id);
    if (foundPattern) {
      return foundPattern;
    }
    throw new Error(PATTERN_NOT_FOUND);
  }

  async updatePattern(id, pattern) {
    const foundPattern = await Pattern.findByIdAndUpdate(id, pattern, {
      new: true,
    });
    if (foundPattern) {
      return foundPattern;
    }
    throw new Error(PATTERN_NOT_FOUND);
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

  async checkPatternExist(data) {
    const patternsCount = await Pattern.countDocuments({
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
