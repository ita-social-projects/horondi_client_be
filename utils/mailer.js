const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const {
  MAIL_USER,
  GMAIL_EMAIL_SERVICE,
  GMAIL_API_ID,
  GMAIL_API_SECRET,
  GMAIL_API_REDIRECT_URI,
  GMAIL_API_REFRESH_TOKEN,
} = require('../dotenvValidator');

const necesarryMailCredentials = [
  'clientId',
  'clientSecret',
  'clientEmail',
  'emailService',
  'redirectUri',
  'refreshToken',
];

class Mailer {
  constructor(opts = {}, onError) {
    if (!opts) {
      throw new Error('Mailer parameters required');
    }

    Object.keys(opts).forEach(key => {
      if (!necesarryMailCredentials.includes(key)) {
        throw new Error(`Please add '${key}' property to mailer options!`);
      }
    });

    this.opts = opts;
    this.onError = onError;
    this.transporter = null;
  }

  async getAccessToken() {
    const oAuth2Client = new google.auth.OAuth2(
      this.opts.clientId,
      this.opts.clientSecret,
      this.opts.redirectUri
    );
    oAuth2Client.setCredentials({ refresh_token: this.opts.refreshToken });

    return await oAuth2Client.getAccessToken();
  }

  async createTransport() {
    this.transporter = nodemailer.createTransport({
      service: this.opts.emailService,
      auth: {
        type: 'OAuth2',
        user: this.opts.clientEmail,
        clientId: this.opts.clientId,
        clientSecret: this.opts.clientSecret,
        refreshToken: this.opts.refreshToken,
        accessToken: await this.getAccessToken(),
      },
    });

    return this.transporter;
  }

  async verifyConnection(transporter) {
    return await (transporter || this.transporter).verify();
  }

  async reconnect() {
    await this.createTransport();
  }

  async sendMail(opts) {
    try {
      await this.transporter.sendMail(opts);
    } catch (err) {
      this.onError && this.onError(err);
    }
  }
}

module.exports = Mailer;
