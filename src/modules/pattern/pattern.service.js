const Pattern = require('./pattern.model');

const patternErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Гобелен  не знайдено' },
  { lang: 'eng', value: 'Pattern not found' },
]);
class PatternsService {
  async getAllPatterns() {
    return await Pattern.find() || new Error(patternErrorMessage);
  }

  async getPatternById(id) {
    return await Pattern.findById(id) || new Error(patternErrorMessage);
  }

  async updatePattern(id, pattern) {
    return await Pattern.findByIdAndUpdate(id, pattern) || new Error(patternErrorMessage);
  }

  async addPattern(data) {
    const pattern = new Pattern(data);
    await pattern.save();
    return pattern;
  }

  async deletePattern(id) {
    return !(await Pattern.findByIdAndDelete(id))?new Error('Шаблон не знайдено'):null
  }
}
module.exports = new PatternsService();
