const Pattern = require('./pattern.model');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
} = require('../../error-messages/pattern.messages');

class PatternsService {
  async getAllPatterns() {
    const pattern = await Pattern.find();
    if (pattern) {
      return pattern;
    }
    throw new Error(PATTERN_NOT_FOUND);
  }

  async getPatternById(id) {
    return await Pattern.findById(id);
  }

  async updatePattern(id, pattern) {
    if (await this.checkPatternExist(pattern)) {
      throw new Error(PATTERN_ALREADY_EXIST);
    }
    return await Pattern.findByIdAndUpdate(id, pattern, { new: true });
  }

  async addPattern(data) {
    if (await this.checkPatternExist(data)) {
      throw new Error(PATTERN_ALREADY_EXIST);
    }
    return new Pattern(data).save();
  }

  async deletePattern(id) {
    return await Pattern.findByIdAndDelete(id);
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
