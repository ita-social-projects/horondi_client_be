const Restriction = require('./restriction.model');
const RuleError = require('../../errors/rule.error');
const {
  restrictionMessages: { NOT_FOUND },
} = require('../../consts/restriction.messages');
const {
  STATUS_CODES: { FORBIDDEN },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_RESTRICTION, EDIT_RESTRICTION, DELETE_RESTRICTION },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  getChanges,
  generateHistoryChangesData,
} = require('../../utils/hisrory');
const { addHistoryRecord } = require('../history/history.service');
const {
  HISTORY_OBJ_KEYS: { COMPARE_BY_EXPRESSION, OPTIONS },
} = require('../../consts/history-obj-keys');

class RestrictionService {
  async getAllRestrictions({ skip, limit }) {
    const items = await Restriction.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Restriction.find()
      .countDocuments()
      .exec();
    return {
      items,
      count,
    };
  }

  async addRestriction({ restriction }, { _id: adminId }) {
    const newRestriction = await new Restriction({ ...restriction }).save();

    const historyRecord = generateHistoryObject(
      ADD_RESTRICTION,
      '',
      '',
      newRestriction._id,
      [],
      generateHistoryChangesData(newRestriction, [
        COMPARE_BY_EXPRESSION,
        OPTIONS,
      ]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newRestriction;
  }

  async updateRestriction({ id, restriction }, { _id: adminId }) {
    const restrictionItem = await Restriction.findById(id)
      .lean()
      .exec();

    if (!restrictionItem) {
      throw new RuleError(NOT_FOUND, FORBIDDEN);
    }

    const { beforeChanges, afterChanges } = getChanges(
      restrictionItem,
      restriction
    );

    const historyRecord = generateHistoryObject(
      EDIT_RESTRICTION,
      '',
      '',
      restrictionItem._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return await Restriction.findByIdAndUpdate(
      id,
      { ...restriction },
      {
        new: true,
      }
    ).exec();
  }

  async deleteRestriction({ id }, { _id: adminId }) {
    const foundRestriction = await Restriction.findByIdAndDelete(id)
      .lean()
      .exec();

    if (!foundRestriction) {
      throw new RuleError(NOT_FOUND, FORBIDDEN);
    }

    const historyRecord = generateHistoryObject(
      DELETE_RESTRICTION,
      '',
      '',
      foundRestriction._id,
      generateHistoryChangesData(foundRestriction, [
        COMPARE_BY_EXPRESSION,
        OPTIONS,
      ]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return foundRestriction;
  }
}

module.exports = new RestrictionService();
