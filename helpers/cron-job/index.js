const { unlockUsers } = require('./unlock-users');
const { currencyRecalculation } = require('./currency-recalculation');
const { clearLogs } = require('./clear-logs-in-mongodb');

const cronJob = () => {
  unlockUsers();
  currencyRecalculation();
  clearLogs();
};

module.exports = {
  cronJob,
};
