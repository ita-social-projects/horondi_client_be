const Position = require('./position.model');

const RuleError = require('../../errors/rule.error');
const {
  POSITION_NOT_FOUND,
  POSITION_ALREADY_EXIST,
} = require('../../error-messages/positions.massage');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');
const {
  HISTORY_ACTIONS: { ADD_POSITION, DELETE_POSITION, EDIT_POSITION },
} = require('../../consts/history-actions');
const {
  generateHistoryObject,
  generateHistoryChangesData,
  getChanges,
} = require('../../utils/history');
const { addHistoryRecord } = require('../history/history.service');
const {
  LANGUAGE_INDEX: { UA },
} = require('../../consts/languages');
const {
  HISTORY_OBJ_KEYS: { NAME, POSITIONS },
} = require('../../consts/history-obj-keys');

class PositionService {
  async checkPositionExist(data) {
    const positionCount = await Position.countDocuments({
      name: {
        $elemMatch: {
          $or: data.name.map(({ value }) => ({ value })),
        },
      },
    }).exec();
    return positionCount > 0;
  }

  async getAllPositions(limit, skip, filter) {
    const filterOptions = {};

    if (filter?.search) {
      filterOptions['name.0.value'] = {
        $regex: `${filter.search.trim()}`,
        $options: 'i',
      };
    }

    const items = await Position.find(filterOptions)
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await Position.countDocuments(filterOptions).exec();

    return { items, count };
  }

  async getPositionById(id) {
    const position = await Position.findById(id).exec();
    if (position) {
      return position;
    }
    throw new RuleError(POSITION_NOT_FOUND, NOT_FOUND);
  }

  async addPosition(positionData, { _id: adminId }) {
    if (await this.checkPositionExist(positionData)) {
      throw new RuleError(POSITION_ALREADY_EXIST);
    }

    const newPosition = await new Position(positionData).save();

    const historyRecord = generateHistoryObject(
      ADD_POSITION,
      null,
      newPosition.name[UA].value,
      newPosition._id,
      [],
      generateHistoryChangesData(newPosition, [NAME, POSITIONS]),
      adminId
    );

    await addHistoryRecord(historyRecord);

    return newPosition;
  }

  async deletePosition(id, { _id: adminId }) {
    const position = await Position.findById(id).exec();
    if (!position) {
      throw new Error(POSITION_NOT_FOUND);
    }
    const deletedPosition = await Position.findByIdAndDelete(id).exec();

    const historyRecord = generateHistoryObject(
      DELETE_POSITION,
      null,
      deletedPosition.name[UA].value,
      deletedPosition._id,
      generateHistoryChangesData(deletedPosition, [NAME, POSITIONS]),
      [],
      adminId
    );

    await addHistoryRecord(historyRecord);

    return deletedPosition;
  }

  async updatePosition(id, position, { _id: adminId }) {
    const positionToUpdate = await Position.findById(id).exec();

    if (!positionToUpdate) {
      throw new RuleError(POSITION_NOT_FOUND, NOT_FOUND);
    }

    const { beforeChanges, afterChanges } = getChanges(
      positionToUpdate,
      position
    );

    const historyRecord = generateHistoryObject(
      EDIT_POSITION,
      null,
      positionToUpdate.name[UA].value,
      positionToUpdate._id,
      beforeChanges,
      afterChanges,
      adminId
    );

    await addHistoryRecord(historyRecord);

    return Position.findByIdAndUpdate(id, position, {
      new: true,
    }).exec();
  }
}

module.exports = new PositionService();
