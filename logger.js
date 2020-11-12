const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ message, timestamp }) => {
      const winstonMessage = JSON.parse(message + '');
      return `Date=${timestamp} key=${winstonMessage.key} value=${winstonMessage.value} `;
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
