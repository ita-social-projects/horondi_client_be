const path = require('path');

const EmailTemplates = require('email-templates');
const Mailer = require('./mailer');

const { getLogger: getLoggerHttp } = require('../loggerHttp');
const logger = require('../logger');

const {
  INVALID_CONNECTION,
  INVALID_AUTH,
} = require('../error-messages/email.messages');

const {
  STATUS_CODES: { NOT_FOUND, UNAUTHORIZED },
} = require('../consts/status-codes');

const {
  MAIL_USER,
  GMAIL_EMAIL_SERVICE,
  GMAIL_API_ID,
  GMAIL_API_SECRET,
  GMAIL_API_REDIRECT_URI,
  GMAIL_API_REFRESH_TOKEN,
  FRONT_BASE_URI,
  ADMIN_BASE_URI,
} = require('../dotenvValidator');

const contextExtension = {
  frontendUrl: FRONT_BASE_URI,
  adminUrl: ADMIN_BASE_URI,
};

const onSendMailError = err => {
  getLoggerHttp().error(JSON.stringify({ key: err.code, value: err.message }));
};

const mailer = new Mailer(
  {
    clientId: GMAIL_API_ID,
    clientSecret: GMAIL_API_SECRET,
    clientEmail: MAIL_USER,
    emailService: GMAIL_EMAIL_SERVICE,
    redirectUri: GMAIL_API_REDIRECT_URI,
    refreshToken: GMAIL_API_REFRESH_TOKEN,
  },
  onSendMailError
);

(async () => {
  try {
    await mailer.createTransport();
    if (await mailer.verifyConnection()) {
      logger.notice('MAILER CONNECTION CORRECT.');
    } else {
      getLoggerHttp().error(
        JSON.stringify({ key: UNAUTHORIZED, value: INVALID_AUTH })
      );
      await mailer.reconnect();
    }
  } catch (err) {
    getLoggerHttp().error(
      JSON.stringify({ key: NOT_FOUND, value: INVALID_CONNECTION })
    );
  }
})();

const emailTemplates = new EmailTemplates({
  message: {},
  views: {
    root: path.resolve(__dirname, '../', 'email-templates'),
  },
});

module.exports = {
  contextExtension,
  transporter: mailer,
  emailTemplates,
};
