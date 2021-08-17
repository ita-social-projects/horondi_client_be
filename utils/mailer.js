const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const necesarryMailCredentials = [
  'clientId',
  'clientSecret',
  'clientEmail',
  'emailService',
  'redirectUri',
  'refreshToken',
];

class Mailer {
  constructor(opts, onError) {
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
      secure: true,
      requireTLS: true,
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
    this.closeConnection();
    return await this.createTransport();
  }

  async sendMail(opts) {
    let result = {};

    try {
      result = await this.transporter.sendMail(opts);
    } catch (err) {
      this.onError && this.onError(err);
    }

    this.closeConnection();
    return result;
  }

  closeConnection() {
    try {
      this.transporter.close();
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = Mailer;
