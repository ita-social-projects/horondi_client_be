const {
  rememberAboutUnfinishedCartOperations,
} = require('./remember-about-unfinished-cart-operations');
const { unlockUsers } = require('./unlock-users');
const { currencyRecalculation } = require('./currency-recalculation');
const { clearLogs } = require('./clear-logs-in-mongodb');

const cronJob = () => {
  rememberAboutUnfinishedCartOperations();
  unlockUsers();
  currencyRecalculation();
  clearLogs();
};

module.exports = {
  cronJob,
};
