const { uploadSmallImage } = require('../upload/upload.utils');
const Pattern = require('./pattern.model');
const RuleError = require('../../errors/rule.error');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

const { calculateAdditionalPrice } = require('../currency/currency.utils');
const {
  PATTERN_NOT_FOUND,
  IMAGE_NOT_PROVIDED,
} = require('../../error-messages/pattern.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const uploadService = require('../upload/upload.service');
const {
  HISTORY_ACTIONS: { ADD_PATTERN, DELETE_PATTERN, EDIT_PATTERN },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: {
    NAME,
    DESCRIPTION,
    AVAILABLE,
    FEATURES,
    ADDITIONAL_PRICE,
    MODEL,
    OPTION_TYPE,
  },
} = require('../../consts/history-obj-keys');
const { updatePrices } = require('../product/product.service');
const {
  INPUT_FIELDS: { PATTERN },
} = require('../../consts/input-fields');

class PatternsService {
  async getAllPatterns(limit, skip, filter) {
    const filterOptions = {};

    if (filter?.name) {
      const name = filter.name.trim();

      filterOptions.$or = [
        { 'name.value': { $regex: `${name}`, $options: 'i' } },
        { 'description.value': { $regex: `${name}`, $options: 'i' } },
      ];
    }

    if (filter?.model.length) {
      filterOptions.model = { $in: filter.model };
    }

    if (filter?.available.length) {
      filterOptions.available = { $in: filter.available };
    }

    if (filter?.handmade.length) {
      filterOptions['features.handmade'] = { $in: filter.handmade };
    }

    if (filter?.material.length) {
      filterOptions['features.material'] = { $in: filter.material };
    }

    const items = await Pattern.find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Pattern.countDocuments(filterOptions).exec();

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

    if (pattern.additionalPrice) {
      pattern.additionalPrice = await calculateAdditionalPrice(
        pattern.additionalPrice
      );
    }

    await updateTranslations(
      patternToUpdate.translationsKey,
      createTranslations(pattern)
    );

    await updatePrices(patternToUpdate, pattern, PATTERN, id);

    const { beforeChanges, afterChanges } = getChanges(
      patternToUpdate,
      pattern
    );

    const historyRecord = generateHistoryObject(
      EDIT_PATTERN,
      patternToUpdate.model?._id,
      patternToUpdate.name[UA].value,
      patternToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    if (!image) {
      return Pattern.findByIdAndUpdate(id, pattern, {
        new: true,
      }).exec();
    }

    if (image[0].file) {
      const uploadResult = await uploadService.uploadFile(image[0]);
      pattern.images = uploadResult.fileNames;
    }
    if (image[1]) {
      const constructorImg = await uploadSmallImage(image[1]);
      pattern.constructorImg = constructorImg;
    }

    const foundPattern = await Pattern.findById(id)
      .lean()
      .exec();

    await uploadService.deleteFiles(Object.values(foundPattern.images));
    await uploadService.deleteFiles([foundPattern.constructorImg]);

    return Pattern.findByIdAndUpdate(
      id,
      {
        ...pattern,
      },
      {
        new: true,
      }
    ).exec();
  }

  async addPattern({ pattern, image }, { _id: adminId }) {
    if (!image) {
      throw new RuleError(IMAGE_NOT_PROVIDED, BAD_REQUEST);
    }

    const uploadResult = await uploadService.uploadFile(image[0]);
    const images = uploadResult.fileNames;
    pattern.constructorImg = await uploadSmallImage(image[1]);

    if (pattern.additionalPrice) {
      pattern.additionalPrice = await calculateAdditionalPrice(
        pattern.additionalPrice
      );
    }
    pattern.translationsKey = await addTranslations(
      createTranslations(pattern)
    );

    const newPattern = await new Pattern({ ...pattern, images }).save();
    const historyRecord = generateHistoryObject(
      ADD_PATTERN,
      newPattern.model?._id,
      newPattern.name[UA].value,
      newPattern._id,
      [],
      generateHistoryChangesData(newPattern, [
        NAME,
        DESCRIPTION,
        MODEL,
        OPTION_TYPE,
        FEATURES,
        ADDITIONAL_PRICE,
        AVAILABLE,
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

    await deleteTranslations(foundPattern.translationsKey);

    const deletedImages = await uploadService.deleteFiles(
      Object.values(foundPattern.images)
    );

    await uploadService.deleteFiles([foundPattern.constructorImg]);
    if (await Promise.allSettled(deletedImages)) {
      const historyRecord = generateHistoryObject(
        DELETE_PATTERN,
        foundPattern.model,
        foundPattern.name[UA].value,
        foundPattern._id,
        generateHistoryChangesData(foundPattern, [
          NAME,
          DESCRIPTION,
          MODEL,
          OPTION_TYPE,
          FEATURES,
          ADDITIONAL_PRICE,
          AVAILABLE,
        ]),
        [],
        adminId
      );

      await addHistoryRecord(historyRecord);

      return foundPattern;
    }
    return Pattern.findByIdAndDelete(id).exec();
  }
}

module.exports = new PatternsService();
