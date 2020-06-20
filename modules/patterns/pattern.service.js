const Pattern = require('../../models/Pattern');

class PatternsService {
  getAllPatterns() {
    return Pattern.find();
  }

  getPatternById(id) {
    return Pattern.findById(id);
  }

  addPattern(data) {
    const pattern = new Pattern(data);
    pattern.save();
    return pattern;
  }

  deletePattern(id) {
    return Pattern.findByIdAndDelete(id);
  }
}
module.exports = new PatternsService();
