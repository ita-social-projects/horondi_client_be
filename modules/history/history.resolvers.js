const {
  getAllHistoryRecords,
  getHistoryRecordById,
} = require('./history.service');
const RuleError = require('../../errors/rule.error');

const historyQuery = {
  getAllHistoryRecords: async (_, { limit, skip, filter }) => {
    try {
      return await getAllHistoryRecords(limit, skip, filter);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
  getHistoryRecordById: async (_, { id }) => {
    try {
      return await getHistoryRecordById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

module.exports = { historyQuery };
