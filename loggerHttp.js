const winston = require('winston');
const { MONGO_URL } = require('./dotenvValidator');

require('winston-mongodb');

const OneWeekInSeconds = 604800;

const mongoLogOptions = {
  name: 'log_info',
  storeHost: true,
  db: MONGO_URL,
  expire: OneWeekInSeconds,
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
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.MongoDB(mongoLogOptions),
  ],
});

module.exports = loggerHttp;
