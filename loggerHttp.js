const winston = require('winston');
const { MONGO_URL, NODE_ENV } = require('./dotenvValidator');

require('winston-mongodb');

const OneWeekInSeconds = 604800;

let errorLogFilename = 'error.log';
let logFilename = 'combined.log';

if (NODE_ENV === 'test') {
  errorLogFilename = 'test-error.log';
  logFilename = 'test-combined.log';
}

const mongoLogOptions = {
  name: 'log_info',
  storeHost: true,
  db: MONGO_URL,
  expire: Math.floor(OneWeekInSeconds / 7), // 1 day
  collection: 'logs',
  capped: true,
};

const loggerHttp = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.metadata()
  ),

  defaultMeta: { service: 'user-service' },
  transports: [new winston.transports.MongoDB(mongoLogOptions)],
});

module.exports = loggerHttp;
