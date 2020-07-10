const Pattern = require('./pattern.model');

const patternErrorMessage = JSON.stringify([
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
    return (await Pattern.find()) || new Error(patternErrorMessage);
  }

  async getPatternById(id) {
    return (await Pattern.findById(id)) || new Error(patternErrorMessage);
  }

  async updatePattern(id, pattern) {
    return (
      (await Pattern.findByIdAndUpdate(id, pattern))
      || new Error(patternErrorMessage)
    );
  }

  async addPattern(data) {
    return new Pattern(data).save;
  }

  async deletePattern(id) {
    return (
      (await Pattern.findByIdAndDelete(id)) || new Error(patternErrorMessage)
    );
  }
}
module.exports = new PatternsService();
