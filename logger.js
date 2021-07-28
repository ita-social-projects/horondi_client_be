const winston = require('winston');

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ message, timestamp }) => {
      try {
        const winstonMessage = JSON.parse(`${message}`);
        return `Date=${timestamp} key=${winstonMessage.key} value=${winstonMessage.value} `;
      } catch (err) {
        return message;
      }
    })
  ),

  transports: [new winston.transports.Console()],
});

module.exports = logger;
