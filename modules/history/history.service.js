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

    let items = await HistoryModel.find()
      .populate('userId', null, 'User', { role: 'user' })
      .lean()
      .limit(limit)
      .skip(skip)
      .exec();

    items = items.filter(value => value.userId);

    console.log(items);

    const count = await HistoryModel.find()
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
