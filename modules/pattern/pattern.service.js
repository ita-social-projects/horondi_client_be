const Pattern = require('./pattern.model');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
  IMAGE_NOT_PROVIDED,
} = require('../../error-messages/pattern.messages');
const uploadService = require('../upload/upload.service');

class PatternsService {
  async getAllPatterns({ skip, limit }) {
    const items = Pattern.find()
      .skip(skip)
      .limit(limit);
    const count = Pattern.find().countDocuments();

    return {
      items,
      count,
    };
  }

  async getPatternById(id) {
    const foundPattern = Pattern.findById(id);
    if (foundPattern) {
      return foundPattern;
    }
    throw new Error(PATTERN_NOT_FOUND);
  }

  async updatePattern({ id, pattern, image }) {
    const patternToUpdate = Pattern.findById(id);
    if (!patternToUpdate) {
      throw new Error(PATTERN_NOT_FOUND);
    }

    if (await this.checkPatternExist(pattern, id)) {
      throw new Error(PATTERN_ALREADY_EXIST);
    }
    if (!image) {
      return Pattern.findByIdAndUpdate(id, pattern, { new: true });
    }
    const uploadResult = await uploadService.uploadFiles([image]);

    const imageResults = await uploadResult[0];

    const images = imageResults.fileNames;

    if (!images) {
      return Pattern.findByIdAndUpdate(id, pattern);
    }
    const foundPattern = Pattern.findById(id).lean();
    uploadService.deleteFiles(Object.values(foundPattern.images));

    return Pattern.findByIdAndUpdate(
      id,
      {
        ...pattern,
        images,
      },
      {
        new: true,
      }
    );
  }

  async addPattern({ pattern, image }) {
    if (await this.checkPatternExist(pattern)) {
      throw new Error(PATTERN_ALREADY_EXIST);
    }

    const uploadResult = await uploadService.uploadFiles([image]);

    const imageResults = await uploadResult[0];

    const images = imageResults.fileNames;
    if (!images) {
      throw new Error(IMAGE_NOT_PROVIDED);
    }
    return new Pattern({ ...pattern, images }).save();
  }

  async deletePattern(id) {
    const foundPattern = Pattern.findByIdAndDelete(id).lean();
    if (!foundPattern) {
      throw new Error(PATTERN_NOT_FOUND);
    }

    const deletedImages = await uploadService.deleteFiles(
      Object.values(foundPattern.images)
    );
    if (await Promise.allSettled(deletedImages)) {
      return foundPattern;
    }
  }

  async checkPatternExist(data, id) {
    const patternsCount = Pattern.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return patternsCount > 0;
  }
}
module.exports = new PatternsService();
