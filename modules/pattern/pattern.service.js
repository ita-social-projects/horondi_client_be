const Pattern = require('./pattern.model');

const PATTERN_NOT_FOUND = JSON.stringify([
  {
    lang: 'uk',
    value: 'Гобелен  не знайдено',
  },
  {
    lang: 'eng',
    value: 'Pattern not found',
  },
]);
class PatternsService {
  async getAllPatterns() {
    const pattern = await Pattern.find();
    return pattern;
  }

  async getPatternById(id) {
    return (await Pattern.findById(id)) || new Error(PATTERN_NOT_FOUND);
  }

  async updatePattern(id, pattern) {
    return (
      (await Pattern.findByIdAndUpdate(id, pattern))
      || new Error(PATTERN_NOT_FOUND)
    );
  }

  async addPattern(data) {
    return new Pattern(data).save();
  }

  async deletePattern(id) {
    return (
      (await Pattern.findByIdAndDelete(id)) || new Error(PATTERN_NOT_FOUND)
    );
  }
}
module.exports = new PatternsService();
