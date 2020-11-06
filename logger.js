const winston = require('winston');
require('dotenv').config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ message, timestamp }) => {
      const winstonMessage = JSON.parse(message);
      return `Date=${timestamp} value=${winstonMessage.value} key=${winstonMessage.key}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
