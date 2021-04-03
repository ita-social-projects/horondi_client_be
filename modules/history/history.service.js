const HistoryModel = require('./history.model');

class HistoryService {
  async getAllHistoryRecords(limit, skip) {
    const items = await HistoryModel.find()
      .limit(limit)
      .skip(skip)
      .exec();
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
