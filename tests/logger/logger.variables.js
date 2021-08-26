const winston = require('winston');

const { dotenvVariables, MONGO_URL } = require('../../dotenvValidator');

const regularLogMessage = 'Simple message';

const logLevels = Object.keys(winston.config.syslog.levels);
const totalLevelsCount = logLevels.length;

const logString = JSON.stringify({
  key: dotenvVariables[0],
  value: process.env[dotenvVariables[0]],
});

const messageString = JSON.stringify({
  method: 'req.method',
  baseUrl: 'req.baseUrl',
  date: 'req.fresh',
  ip: 'req.remoteAddress',
});

const matchLogString = `key=${dotenvVariables[0]} value=`;

module.exports = {
  regularLogMessage,
  logLevels,
  totalLevelsCount,
  logString,
  matchLogString,
  messageString,
  dbUri: MONGO_URL,
};
