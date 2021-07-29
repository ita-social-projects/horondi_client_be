const winston = require('winston');
const Path = require('path');

const { dotenvVariables } = require('../../dotenvValidator');

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

const logFilename = Path.resolve(__dirname, '../../test-combined.log');
const errorLogFilename = Path.resolve(__dirname, '../../test-error.log');

module.exports = {
  regularLogMessage,
  logLevels,
  totalLevelsCount,
  logString,
  matchLogString,
  logFilename,
  errorLogFilename,
  messageString,
};
