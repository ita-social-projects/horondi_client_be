const { uploadSmallImage } = require('../upload/upload.utils');
const Pattern = require('./pattern.model');
const Product = require('../product/product.model');
const RuleError = require('../../errors/rule.error');
const createTranslations = require('../../utils/createTranslations');
const {
  addTranslations,
  updateTranslations,
  deleteTranslations,
} = require('../translations/translations.service');

const {
  PATTERN_NOT_FOUND,
  IMAGE_NOT_PROVIDED,
  PATTERN_IS_IN_PRODUCT,
} = require('../../error-messages/pattern.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const uploadService = require('../upload/upload.service');
const {
  HISTORY_ACTIONS: { ADD_EVENT, DELETE_EVENT, EDIT_EVENT },
  HISTORY_NAMES: { PATTERN_EVENT },
} = require('../../consts/history-events');
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

    await updateTranslations(
      patternToUpdate.translationsKey,
      createTranslations(pattern)
    );

    if (image) {
      const [imagePattern, imageConstructor] = image;
      if (imagePattern.file) {
        const uploadResult = await uploadService.uploadFile(imagePattern);
        pattern.images = uploadResult.fileNames;
      }
      if (imageConstructor) {
        const constructorImg = await uploadSmallImage(imageConstructor);
        pattern.constructorImg = constructorImg;
      }
      const foundPattern = await Pattern.findById(id).lean().exec();

      await uploadService.deleteFiles(Object.values(foundPattern.images));
      await uploadService.deleteFiles([foundPattern.constructorImg]);
    }

    const updatedPattern = await Pattern.findByIdAndUpdate(id, pattern, {
      new: true,
    }).exec();

    await updatePrices(PATTERN, id);

    const { beforeChanges, afterChanges } = getChanges(
      patternToUpdate,
      pattern
    );
    const historyEvent = {
      action: EDIT_EVENT,
      historyName: PATTERN_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
      patternToUpdate.model?._id,
      patternToUpdate.name[UA].value,
      patternToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );
    await addHistoryRecord(historyRecord);

    return updatedPattern;
  }

  async addPattern({ pattern, image }, { _id: adminId }) {
    if (!image) {
      throw new RuleError(IMAGE_NOT_PROVIDED, BAD_REQUEST);
    }

    const uploadResult = await uploadService.uploadFile(image[0]);
    const images = uploadResult.fileNames;
    pattern.constructorImg = await uploadSmallImage(image[1]);

    pattern.translationsKey = await addTranslations(
      createTranslations(pattern)
    );

    const newPattern = await new Pattern({ ...pattern, images }).save();
    const historyEvent = {
      action: ADD_EVENT,
      historyName: PATTERN_EVENT,
    };
    const historyRecord = generateHistoryObject(
      historyEvent,
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
    const foundPattern = await Pattern.findById(id).lean().exec();
    if (!foundPattern) {
      throw new RuleError(PATTERN_NOT_FOUND, NOT_FOUND);
    }
    const productsWithPatern = await Product.find({
      pattern: id,
      isDeleted: false,
    }).exec();
    if (productsWithPatern.length) {
      throw new RuleError(PATTERN_IS_IN_PRODUCT, NOT_FOUND);
    }

    await deleteTranslations(foundPattern.translationsKey);

    const deletedImages = await uploadService.deleteFiles(
      Object.values(foundPattern.images)
    );

    await uploadService.deleteFiles([foundPattern.constructorImg]);
    if (await Promise.allSettled(deletedImages)) {
      const historyEvent = {
        action: DELETE_EVENT,
        historyName: PATTERN_EVENT,
      };
      const historyRecord = generateHistoryObject(
        historyEvent,
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

      return Pattern.findByIdAndDelete(id).lean().exec();
    }
  }
}

module.exports = new PatternsService();
