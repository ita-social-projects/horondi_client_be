const {
  MAIL_USER,
  GMAIL_EMAIL_SERVICE,
  GMAIL_API_ID,
  GMAIL_API_SECRET,
  GMAIL_API_REDIRECT_URI,
  GMAIL_API_REFRESH_TOKEN,
} = require('../../dotenvValidator');

const transportOptions = {
  clientId: GMAIL_API_ID,
  clientSecret: GMAIL_API_SECRET,
  clientEmail: MAIL_USER,
  emailService: GMAIL_EMAIL_SERVICE,
  redirectUri: GMAIL_API_REDIRECT_URI,
  refreshToken: GMAIL_API_REFRESH_TOKEN,
};

const messageOptions = {};

const wrongMessageOptions = {
  from: MAIL_USER,
  to: undefined,
};

module.exports = {
  transportOptions,
  messageOptions,
  wrongMessageOptions,
};
