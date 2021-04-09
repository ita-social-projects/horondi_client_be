const _ = require('lodash');

const HistoryModel = require('./history.model');

class HistoryService {
  async getAllHistoryRecords(limit, skip, filter) {
    const filterOptions = {};
    const filterUserOptions = {};

    if (filter.action?.length) {
      filterOptions.action = { $in: filter.action };
    }
    if (filter.role?.length) {
      filterUserOptions.role = { $in: filter.role };
    }

    const items = await HistoryModel.find(filterOptions)
      .populate({
        path: 'userId',
        match: filterUserOptions,
      })
      .limit(limit)
      .skip(skip)
      .exec();

    const count = await HistoryModel.find(filterOptions)
      .populate({
        path: 'userId',
        match: filterUserOptions,
      })
      .countDocuments()
      .exec();

    return {
      items,
      count,
    };
  }

  async addHistoryRecord(record) {
    return new HistoryModel(record).save();
  }
}

module.exports = new HistoryService();
