const { ApolloError } = require('apollo-server');
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
const PATTERN_ALREADY_EXIST = [
  { lang: 'uk', value: 'Гобелен вже існує' },
  { lang: 'eng', value: 'Pattern already exist' },
];
class PatternsService {
  async getAllPatterns() {
    const pattern = await Pattern.find();
    return pattern;
  }

  async getPatternById(id) {
    return (
      (await Pattern.findById(id)) || new ApolloError(PATTERN_NOT_FOUND, 404)
    );
  }

  async updatePattern(id, pattern) {
    return (
      (await Pattern.findByIdAndUpdate(id, pattern, { new: true }))
      || new Error(PATTERN_NOT_FOUND, 404)
    );
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
      return new ApolloError(PATTERN_ALREADY_EXIST, 400);
    }
    return new Pattern(data).save();
  }

  async deletePattern(id) {
    return (
      (await Pattern.findByIdAndDelete(id)) || new Error(PATTERN_NOT_FOUND, 404)
    );
  }
}
module.exports = new PatternsService();
