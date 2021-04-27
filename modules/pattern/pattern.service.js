const { uploadSmallImage } = require('../upload/upload.utils');
const Pattern = require('./pattern.model');
const RuleError = require('../../errors/rule.error');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  PATTERN_ALREADY_EXIST,
  PATTERN_NOT_FOUND,
  IMAGE_NOT_PROVIDED,
} = require('../../error-messages/pattern.messages');
const uploadService = require('../upload/upload.service');
const {
  HISTORY_ACTIONS: { ADD_PATTERN, DELETE_PATTERN, EDIT_PATTERN },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { NAME, DESCRIPTION, MATERIAL, AVAILABLE, HANDMADE },
} = require('../../consts/history-obj-keys');

class PatternsService {
  async getAllPatterns({ skip, limit }) {
    const items = await Pattern.find()
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Pattern.find()
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async getPatternById(id) {
    const foundPattern = await Pattern.findById(id).exec();
    if (foundPattern) {
      return foundPattern;
    }
    throw new RuleError(PATTERN_NOT_FOUND, NOT_FOUND);
  }

  async updatePattern({ id, pattern, image }, { _id: adminId }) {
    const patternToUpdate = await Pattern.findById(id).exec();
    if (!patternToUpdate) {
      throw new RuleError(PATTERN_NOT_FOUND, NOT_FOUND);
    }
    if (await this.checkPatternExist(pattern, id)) {
      throw new RuleError(PATTERN_ALREADY_EXIST, BAD_REQUEST);
    }
    const { beforeChanges, afterChanges } = getChanges(
      patternToUpdate,
      pattern
    );
    const historyRecord = generateHistoryObject(
      EDIT_PATTERN,
      patternToUpdate.material,
      patternToUpdate.name[UA].value,
      patternToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);
    if (!image) {
      return await Pattern.findByIdAndUpdate(id, pattern, { new: true }).exec();
    }

    const uploadResult = await uploadService.uploadFile(image[0]);
    const images = uploadResult.fileNames;
    const constructorImg = await uploadSmallImage(image[1]);
    pattern.constructorImg = constructorImg;

    if (!images && constructorImg) {
      return await Pattern.findByIdAndUpdate(id, pattern).exec();
    }
    const foundPattern = await Pattern.findById(id)
      .lean()
      .exec();
    await uploadService.deleteFiles(Object.values(foundPattern.images));
    await uploadService.deleteFiles([foundPattern.constructorImg]);

    return await Pattern.findByIdAndUpdate(
      id,
      {
        ...pattern,
        images,
      },
      {
        new: true,
      }
    ).exec();
  }

  async addPattern({ pattern, image }, { _id: adminId }) {
    if (await this.checkPatternExist(pattern)) {
      throw new RuleError(PATTERN_ALREADY_EXIST, BAD_REQUEST);
    }

    if (image.length) {
      if (!image[0] && !image[1]) {
        throw new RuleError(IMAGE_NOT_PROVIDED, BAD_REQUEST);
      }
    }

    const uploadResult = await uploadService.uploadFile(image[0]);
    const images = uploadResult.fileNames;
    pattern.constructorImg = await uploadSmallImage(image[1]);

    const newPattern = await new Pattern({ ...pattern, images }).save();
    const historyRecord = generateHistoryObject(
      ADD_PATTERN,
      newPattern.material,
      newPattern.name[UA].value,
      newPattern._id,
      [],
      generateHistoryChangesData(newPattern, [
        NAME,
        MATERIAL,
        AVAILABLE,
        DESCRIPTION,
        HANDMADE,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newPattern;
  }

  async deletePattern(id, { _id: adminId }) {
    const foundPattern = await Pattern.findByIdAndDelete(id)
      .lean()
      .exec();
    if (!foundPattern) {
      throw new RuleError(PATTERN_NOT_FOUND, NOT_FOUND);
    }

    const deletedImages = await uploadService.deleteFiles(
      Object.values(foundPattern.images)
    );
    await uploadService.deleteFiles([foundPattern.constructorImg]);
    if (await Promise.allSettled(deletedImages)) {
      const historyRecord = generateHistoryObject(
        DELETE_PATTERN,
        foundPattern.material,
        foundPattern.name[UA].value,
        foundPattern._id,
        generateHistoryChangesData(foundPattern, [
          NAME,
          MATERIAL,
          AVAILABLE,
          DESCRIPTION,
          HANDMADE,
        ]),
        [],
        adminId
      );

      await addHistoryRecord(historyRecord);

      return foundPattern;
    }
  }

  async checkPatternExist(data, id) {
    const patternsCount = await Pattern.countDocuments({
      _id: { $ne: id },
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return patternsCount > 0;
  }
}

module.exports = new PatternsService();
