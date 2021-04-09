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
    if (filter.fullName) {
      const [name, surname] = filter.fullName.split(' ');

      filterUserOptions.$or = [
        { firstName: { $regex: `${name || surname}`, $options: 'i' } },
        { lastName: { $regex: `${name || surname}`, $options: 'i' } },
      ];
    }
    if (filter.date) {
      filterOptions.createdAt = {
        $gte: new Date(filter.date.dateFrom).getTime(),
        $lte: new Date(filter.date.dateTo).getTime(),
      };
    }

    const historyRecords = await HistoryModel.find(filterOptions)
      .populate({
        path: 'userId',
        match: filterUserOptions,
      })
      .exec();

    const items = _.take(
      _.drop(
        _.filter(historyRecords, record => record.userId),
        skip
      ),
      limit
    );

    const count = _.filter(historyRecords, record => record.userId).length;

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
