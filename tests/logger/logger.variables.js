const winston = require('winston');

const regularLogMessage = 'Simple message';

const logLevels = Object.keys(winston.config.syslog.levels);
const totalLevelsCount = logLevels.length;

module.exports = {
  regularLogMessage,
  logLevels,
  totalLevelsCount,
};
