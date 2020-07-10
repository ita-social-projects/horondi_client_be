const Pattern = require('./pattern.model');

class PatternsService {
  getAllPatterns() {
    return Pattern.find();
  }

  getPatternById(id) {
    return Pattern.findById(id);
  }

  async updatePattern(id, pattern) {
    return await Pattern.findByIdAndUpdate(id, pattern);
  }

  addPattern(data) {
    const pattern = new Pattern(data);
    return pattern.save();
  }

  async deletePattern(id) {
    return await Pattern.findByIdAndDelete(id);
  }
}
module.exports = new PatternsService();
