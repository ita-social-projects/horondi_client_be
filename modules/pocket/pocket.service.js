const Pocket = require('./pocket.model');
const uploadService = require('../upload/upload.utils');
const { calculatePrice } = require('../currency/currency.utils');
const { checkIfItemExist } = require('../../utils/exist-checker');
const RuleError = require('../../errors/rule.error');
const FilterHelper = require('../../helpers/filter-helper');
const {
  POCKET_ALREADY_EXIST,
  POCKET_NOT_FOUND,
} = require('../../error-messages/pocket.messages');
const {
  STATUS_CODES: { NOT_FOUND, BAD_REQUEST },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_POCKET, EDIT_POCKET, DELETE_POCKET },
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

class PocketService extends FilterHelper {
  async getAllPockets({ filter, pagination, sort }) {
    try {
      let filters = this.filterItems(filter);
      let aggregatedItems = this.aggregateItems(filters, pagination, sort);

      const [pockets] = await Pocket.aggregate()
        .collation({ locale: 'uk' })
        .facet({
          items: aggregatedItems,
          calculations: [{ $match: filters }, { $count: 'count' }],
        })
        .exec();

      let pocketCount;

      const {
        items,
        calculations: [calculations],
      } = pockets;

      if (calculations) {
        pocketCount = calculations.count;
      }

      return {
        items,
        count: pocketCount || 0,
      };
    } catch (e) {
      throw new RuleError(e.message, e.statusCode);
    }
  }

  async getPocketById(id) {
    const foundPocket = await Pocket.findById(id).exec();
    if (foundPocket) {
      return foundPocket;
    }
    throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
  }

  async getPocketsByModel(id) {
    const pocket = Pocket.find({ model: id }).exec();

    if (!pocket) {
      throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
    }
    return pocket;
  }

  async deletePocket(id, { _id: adminId }) {
    const foundPocket = await Pocket.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundPocket) {
      throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
    }

    const historyRecord = generateHistoryObject(
      DELETE_POCKET,
      foundPocket.model,
      foundPocket.name[UA].value,
      foundPocket._id,
      generateHistoryChangesData(foundPocket, [
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

    return foundPocket;
  }

  async updatePocket(id, pocket, image, { _id: adminId }) {
    const pocketToUpdate = await Pocket.findById(id).exec();
    if (!pocketToUpdate) {
      throw new RuleError(POCKET_NOT_FOUND, NOT_FOUND);
    }

    if (pocket.additionalPrice) {
      pocket.additionalPrice = await calculatePrice(pocket.additionalPrice);
    }

    if (!image) {
      return Pocket.findByIdAndUpdate(id, pocket, { new: true }).exec();
    }

    await uploadService.deleteFiles(image);

    const uploadImage = await uploadService.uploadSmallImage(image);
    pocket.image = uploadImage.fileNames.small;

    const { beforeChanges, afterChanges } = getChanges(pocketToUpdate, pocket);

    const historyRecord = generateHistoryObject(
      EDIT_POCKET,
      pocketToUpdate.model?._id,
      pocketToUpdate.name[UA].value,
      pocketToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    await Pocket.findByIdAndUpdate(id, pocket, {
      new: true,
    }).exec();
  }

  async addPocket(pocket, image, { _id: adminId }) {
    const checkResult = await checkIfItemExist(pocket, Pocket);

    if (checkResult) {
      throw new RuleError(POCKET_ALREADY_EXIST, BAD_REQUEST);
    }

    if (image) {
      const uploadImage = await uploadService.uploadSmallImage(image);
      pocket.image = uploadImage.fileNames.small;
    }

    if (pocket.additionalPrice) {
      pocket.additionalPrice = await calculatePrice(pocket.additionalPrice);
    }

    const newPocket = await new Pocket(pocket).save();

    const historyRecord = generateHistoryObject(
      ADD_POCKET,
      newPocket.model?._id,
      newPocket.name[UA].value,
      newPocket._id,
      [],
      generateHistoryChangesData(newPocket, [
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

    return newPocket;
  }
}

module.exports = new PocketService();
