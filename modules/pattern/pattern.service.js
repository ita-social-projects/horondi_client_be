const Pattern = require('./pattern.model');

class PatternsService {
  getAllPatterns() {
    return Pattern.find();
  }

  getPatternById(id) {
    return Pattern.findById(id);
  }

  updatePattern(id, pattern) {
    return Pattern.findByIdAndUpdate(id, pattern);
  }

  addPattern(data) {
    const pattern = new Pattern(data);
    return pattern.save();
  }

  deletePattern(id) {
    return Pattern.findByIdAndDelete(id);
  }
}
module.exports = new PatternsService();
