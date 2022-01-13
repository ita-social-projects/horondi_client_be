const { uploadSmallImage } = require('../upload/upload.utils');
const { calculateBasePrice } = require('../currency/currency.utils');
const {
  commonFiltersHandler,
} = require('../../utils/constructorOptionCommonFilters');
const constructorFrPocketModel = require('./constructor-front-pocket/constructor-front-pocket.model');
const uploadService = require('../upload/upload.service');
const RuleError = require('../../errors/rule.error');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: {
    ADD_CONSTRUCTOR_ELEMENT,
    EDIT_CONSTRUCTOR_ELEMENT,
    DELETE_CONSTRUCTOR_ELEMENT,
  },
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
    BASE_PRICE,
    AVAILABLE,
    FEATURES,
    OPTION_TYPE,
    MODEL,
  },
} = require('../../consts/history-obj-keys');

class ConstructorService {
  async getAllConstructorElements({ limit, skip, filter }, model) {
    const filterOptions = commonFiltersHandler(filter);

    if (filter?.material.length) {
      filterOptions['features.material'] = { $in: filter.material };
    }

    if (filter?.color.length) {
      filterOptions['features.color'] = { $in: filter.color };
    }

    if (model === constructorFrPocketModel) {
      if (filter?.pattern.length) {
        filterOptions['features.pattern'] = { $in: filter.pattern };
      }
    }

    const items = await model
      .find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await model.countDocuments(filterOptions).exec();

    return {
      items,
      count,
    };
  }

  async getConstructorElementById(id, model) {
    const foundElement = await model.findById(id);
    if (foundElement) {
      return foundElement;
    }

    return new RuleError(CONSTRUCTOR_ELEMENT_NOT_FOUND, NOT_FOUND);
  }

  async addConstructorElement(
    { constructorElement, upload },
    Model,
    { _id: adminId }
  ) {
    if (upload) {
      constructorElement.image = await uploadSmallImage(upload);
    }

    constructorElement.basePrice = await calculateBasePrice(
      constructorElement.basePrice
    );

    const basic = await new Model(constructorElement).save();

    const historyRecord = generateHistoryObject(
      ADD_CONSTRUCTOR_ELEMENT,
      basic.model,
      basic.name[UA].value,
      basic._id,
      [],
      generateHistoryChangesData(basic, [
        NAME,
        OPTION_TYPE,
        MODEL,
        FEATURES,
        AVAILABLE,
        BASE_PRICE,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return Model.findById(basic._id);
  }

  async updateConstructorElement(
    { id, constructorElement, upload },
    model,
    { _id: adminId }
  ) {
    const constructorFountElement = await model.findById(id);

    if (!constructorFountElement) {
      return new RuleError(CONSTRUCTOR_ELEMENT_NOT_FOUND, NOT_FOUND);
    }

    if (upload) {
      await uploadService.deleteFile(constructorFountElement.image);
      constructorElement.image = await uploadSmallImage(upload);
    }

    constructorElement.basePrice = await calculateBasePrice(
      constructorElement.basePrice
    );

    const updatedBasic = await model.findByIdAndUpdate(id, constructorElement, {
      new: true,
    });

    const { beforeChanges, afterChanges } = getChanges(
      constructorFountElement,
      constructorElement
    );

    const historyRecord = generateHistoryObject(
      EDIT_CONSTRUCTOR_ELEMENT,
      updatedBasic.model,
      updatedBasic.name[UA].value,
      updatedBasic._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return updatedBasic;
  }

  async deleteConstructorElement(id, model, { _id: adminId }) {
    const constructorElement = await model.findByIdAndDelete(id).exec();

    if (!constructorElement) {
      return new RuleError(CONSTRUCTOR_ELEMENT_NOT_FOUND, NOT_FOUND);
    }

    if (constructorElement.image) {
      await uploadService.deleteFile(constructorElement.image);
    }

    const historyRecord = generateHistoryObject(
      DELETE_CONSTRUCTOR_ELEMENT,
      constructorElement.model,
      constructorElement.name[UA].value,
      constructorElement._id,
      generateHistoryChangesData(constructorElement, [
        NAME,
        OPTION_TYPE,
        MODEL,
        FEATURES,
        AVAILABLE,
        BASE_PRICE,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return constructorElement;
  }
}

module.exports = new ConstructorService();
