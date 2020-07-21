const Pattern = require('./pattern.model');
const {
  PATTERN_ALREADY_EXIST,
} = require('../../error-messages/pattern.messages');

class PatternsService {
  async getAllPatterns() {
    const pattern = await Pattern.find();
    return pattern;
  }

  async getPatternById(id) {
    return await Pattern.findById(id);
  }

  async updatePattern(id, pattern) {
    return await Pattern.findByIdAndUpdate(id, pattern, { new: true });
  }

  async addPattern(data) {
    const pattern = await Pattern.find({
      name: {
        $elemMatch: {
          $or: [{ value: data.name[0].value }, { value: data.name[1].value }],
        },
      },
    });
    if (pattern.length !== 0) {
      return new Error(PATTERN_ALREADY_EXIST);
    }
    return new Pattern(data).save();
  }

  async deletePattern(id) {
    return await Pattern.findByIdAndDelete(id);
  }
}
module.exports = new PatternsService();
