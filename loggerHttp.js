const winston = require('winston');

require('winston-mongodb');

const OneWeekInSeconds = 604800;

module.exports = mongo => {
  const mongoLogOptions = {
    name: 'log_info',
    storeHost: true,
    db: mongo,
    expire: Math.floor(OneWeekInSeconds / 7), // 1 day
    collection: 'logs',
    capped: true,
  };

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.metadata()
    ),

    defaultMeta: { service: 'user-service' },
    transports: [new winston.transports.MongoDB(mongoLogOptions)],
  });
};
