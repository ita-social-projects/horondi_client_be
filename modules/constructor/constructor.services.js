const { uploadSmallImage } = require('../upload/upload.utils');
const { calculatePrice } = require('../currency/currency.utils');
const uploadService = require('../upload/upload.service');
const RuleError = require('../../errors/rule.error');
const {
  CONSTRUCTOR_ELEMENT_NOT_FOUND,
  CONSTRUCTOR_ELEMENT_ALREADY_EXIST,
} = require('../../error-messages/constructor-element-messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
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
} = require('../../utils/hisrory');
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
  async getAllConstructorElements({ skip, limit }, model) {
    const items = await model
      .find()
      .skip(skip)
      .limit(limit);
    const count = await model.find().countDocuments();
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
    model,
    { _id: adminId }
  ) {
    if (upload) {
      constructorElement.image = await uploadSmallImage(upload);
    }
    if (await this.checkConstructorElementExist(constructorElement, model)) {
      return new RuleError(CONSTRUCTOR_ELEMENT_ALREADY_EXIST, BAD_REQUEST);
    }
    constructorElement.basePrice = await calculatePrice(
      constructorElement.basePrice
    );
    const basic = await new model(constructorElement).save();
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

    return await model.findById(basic._id);
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
    constructorElement.basePrice = await calculatePrice(
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
    const constructorElement = await model.findById(id);

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
    return await model.findByIdAndDelete(id);
  }

  async checkConstructorElementExist(data, model) {
    let constructorBasicCount = await model.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    });
    return constructorBasicCount > 0;
  }
}

module.exports = new ConstructorService();
