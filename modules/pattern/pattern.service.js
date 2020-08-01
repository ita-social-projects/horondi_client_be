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
    return await Pattern.findById(id);
  }

  async updatePattern(id, pattern) {
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
    const pattern = await Pattern.find({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    return pattern.length > 0;
  }
}
module.exports = new PatternsService();
