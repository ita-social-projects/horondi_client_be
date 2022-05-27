const { unlockUsers } = require('./unlock-users');
const { clearLogs } = require('./clear-logs-in-mongodb');
const { certificatesExpireCheck } = require('./certificates-expire-check');

const cronJob = () => {
  certificatesExpireCheck();
  unlockUsers();
  clearLogs();
};

module.exports = {
  cronJob,
};
