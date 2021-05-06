const Strap = require('./strap.model');
const RuleError = require('../../errors/rule.error');
const FilterHelper = require('../../helpers/filter-helper');
const uploadService = require('../upload/upload.service');
const { calculatePrice } = require('../currency/currency.utils');
const { STRAP_NOT_FOUND } = require('../../error-messages/strap.messages');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_STRAP, EDIT_STRAP, DELETE_STRAP },
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
    ADDITIONAL_PRICE,
    AVAILABLE,
    FEATURES,
    OPTION_TYPE,
    MODEL,
  },
} = require('../../consts/history-obj-keys');

class StrapService extends FilterHelper {
  async getAllStraps({ filter, pagination, sort }) {
    try {
      let filters = this.filterItems(filter);
      let aggregatedItems = this.aggregateItems(filters, pagination, sort);

      const [straps] = await Strap.aggregate()
        .collation({ locale: 'uk' })
        .facet({
          items: aggregatedItems,
          calculations: [{ $match: filters }, { $count: 'count' }],
        })
        .exec();

      let strapCount;

      const {
        items,
        calculations: [calculations],
      } = straps;

      if (calculations) {
        strapCount = calculations.count;
      }

      return {
        items,
        count: strapCount || 0,
      };
    } catch (e) {
      throw new RuleError(e.message, e.statusCode);
    }
  }

  async getStrapById(id) {
    const foundStrap = await Strap.findById(id).exec();
    if (foundStrap) {
      return foundStrap;
    }
    throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
  }

  async getStrapsByModel(id) {
    const strap = Strap.find({ model: id }).exec();

    if (!strap) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }

    return strap;
  }

  async deleteStrap(id, { _id: adminId }) {
    const foundStrap = await Strap.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundStrap) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }

    await uploadService.deleteFiles(Object.values(foundStrap.image));

    const historyRecord = generateHistoryObject(
      DELETE_STRAP,
      foundStrap.model,
      foundStrap.name[UA].value,
      foundStrap._id,
      generateHistoryChangesData(foundStrap, [
        NAME,
        OPTION_TYPE,
        MODEL,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return foundStrap;
  }

  async updateStrap(id, strap, image, { _id: adminId }) {
    const strapToUpdate = await Strap.findById(id).exec();

    if (!strapToUpdate) {
      throw new RuleError(STRAP_NOT_FOUND, NOT_FOUND);
    }

    if (strap.additionalPrice) {
      strap.additionalPrice = await calculatePrice(strap.additionalPrice);
    }

    if (!image) {
      return Strap.findByIdAndUpdate(id, strap, { new: true }).exec();
    }

    await uploadService.deleteFiles(image);

    const uploadImage = await uploadService.uploadSmallImage(image);
    strap.image = uploadImage.fileNames.small;

    const { beforeChanges, afterChanges } = getChanges(strapToUpdate, strap);

    const historyRecord = generateHistoryObject(
      EDIT_STRAP,
      strapToUpdate.model?._id,
      strapToUpdate.name[UA].value,
      strapToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return Strap.findByIdAndUpdate(id, strap).exec();
  }

  async addStrap(strap, image, { _id: adminId }) {
    if (image) {
      const uploadImage = await uploadService.uploadSmallImage(image);
      strap.image = uploadImage.fileNames.small;
    }

    if (strap.additionalPrice) {
      strap.additionalPrice = await calculatePrice(strap.additionalPrice);
    }

    const newStrap = await new Strap(strap).save();

    const historyRecord = generateHistoryObject(
      ADD_STRAP,
      newStrap.model?._id,
      newStrap.name[UA].value,
      newStrap._id,
      [],
      generateHistoryChangesData(newStrap, [
        NAME,
        OPTION_TYPE,
        MODEL,
        FEATURES,
        AVAILABLE,
        ADDITIONAL_PRICE,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newStrap;
  }
}

module.exports = new StrapService();
