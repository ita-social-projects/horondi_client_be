const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    // winston.format.json(),
    winston.format.printf(({ message, timestamp }) => {
      const winstonMessage = JSON.parse(message + '');
      return `Date=${timestamp} key=${winstonMessage.key} value=${winstonMessage.value} `;
    })
  ),

  // defaultMeta: { service: 'user-service' },

  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
