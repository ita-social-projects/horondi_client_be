const mongoose = require('mongoose');
const { schedule } = require('node-cron');

const clearLogs = () =>
  schedule('0 4 * * *', () => {
    mongoose.connection.db.dropCollection('logs', (err, results) => results);
  });

module.exports = {
  clearLogs,
};
