const Pattern = require('../../models/Pattern');

class PatternsService {
  getAllPatterns() {
    return Pattern.find();
  }

  getPatternById(id) {
    return Pattern.findById(id);
  }

  async addPattern(data) {
    const pattern = await Pattern(data);
    await pattern.save();
  }

  deletePattern(id) {
    return Pattern.findByIdAndDelete(id);
  }
}
module.exports = new PatternsService();
