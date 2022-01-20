const { unlockUsers } = require('./unlock-users');
const { currencyRecalculation } = require('./currency-recalculation');
const { clearLogs } = require('./clear-logs-in-mongodb');
const { certificatesExpireCheck } = require('./certificates-expire-check');

const cronJob = () => {
  certificatesExpireCheck();
  unlockUsers();
  currencyRecalculation();
  clearLogs();
};

module.exports = {
  cronJob,
};
