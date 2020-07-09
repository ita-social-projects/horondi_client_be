const Pattern = require('./pattern.model');

const patternErrorMessage = JSON.stringify([
  { lang: 'uk', value: 'Гобелен  не знайдено' },
  { lang: 'eng', value: 'Pattern not found' },
]);
class PatternsService {
  async getAllPatterns() {
    const pattern = await Pattern.find();
    if (pattern) {
      return pattern;
    }
    return new Error(patternErrorMessage);
  }

  async getPatternById(id) {
    const pattern = await Pattern.findById(id);
    if (pattern) {
      return pattern;
    }
    return new Error(patternErrorMessage);
  }

  async updatePattern(id, pattern) {
    const patternToUpdate = await Pattern.findByIdAndUpdate(id, pattern);
    if (patternToUpdate) {
      return patternToUpdate;
    }
    return new Error(patternErrorMessage);
  }

  async addPattern(data) {
    const pattern = new Pattern(data);
    await pattern.save();
    return { message: 'Гобелен успішно додано' };
  }

  async deletePattern(id) {
    const response = await Pattern.findByIdAndDelete(id);
    if (response) {
      return response;
    }
    return new Error(patternErrorMessage);
  }
}
module.exports = new PatternsService();
