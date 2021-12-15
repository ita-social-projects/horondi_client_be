const mongoose = require('mongoose');
const { schedule } = require('node-cron');
const { EVERY_NIGHT } = require('../../consts/cron-period');

const clearLogs = () =>
  schedule(EVERY_NIGHT, () => {
    mongoose.connection.db.dropCollection('logs', (err, results) => results);
  });

module.exports = {
  clearLogs,
};
