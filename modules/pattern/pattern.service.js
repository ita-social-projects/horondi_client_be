const Pattern = require('./pattern.model');
const {
  PATTERN_ALREADY_EXIST,
} = require('../../error-messages/pattern.messages');
const checkPatternExist = require('../../utils/checkPatternExist');

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
    if (await checkPatternExist(data)) {
      return new Error(PATTERN_ALREADY_EXIST);
    }
    return new Pattern(data).save();
  }

  async deletePattern(id) {
    return await Pattern.findByIdAndDelete(id);
  }
}
module.exports = new PatternsService();
