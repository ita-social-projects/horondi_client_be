const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const {
  MAIL_USER,
  MAIL_PASS,
  MAIL_HOST,
  MAIL_PORT,
  GMAIL_EMAIL_SERVICE,
  MAIL_API_KEY,
} = require('../dotenvValidator');

const CLIENT_MAIL = 'horondisoftserve.devproject@gmail.com';
const CLIENT_ID =
  '194565432193-ps1okm3l98uqr0a811vvedqee598af0l.apps.googleusercontent.com';
const CLIENT_SECRET = '8aE822Y8pTnJmFwy_NO70WL6';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
  '1//04nyKT6HFNZQzCgYIARAAGAQSNwF-L9IrXg8Ruav4gwBAbcf60mtXAAPExAmLawlc2jXZb8LpgmyXe3kpyWlCYRrz2V92GNdq0_o';

class Mailer {
  constructor(opts = {}) {
    if (!opts) {
      throw new Error('Mailer parameters required');
    }

    this.opts = opts;
    this.transporter = null;
  }

  async getAccessToken() {
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    return await oAuth2Client.getAccessToken();
  }

  async createTransport() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: CLIENT_MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: await this.getAccessToken(),
      },
    });

    return this.transporter;
  }

  async verifyConnection(transporter) {
    return await (transporter || this.transporter).verify();
  }

  async sendMail() {
    return await this.transporter.sendMail({
      from: MAIL_USER,
      to: 'wasya1212cool@gmail.com',
      subject: 'templateInfo.subject',
      html: 'ou hi marv',
      text: 'hello world',
    });
  }

  async checkConnection() {
    await this.createTransport();
    const isConnected = await this.verifyConnection();
    if (!isConnected) {
      return false;
    }
    try {
      const result = await this.sendMail();
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }

  // async checkConnection() {
  //   const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
  //   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  //   try {
  //     const accessToken = await oAuth2Client.getAccessToken();
  //     const transport = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         type: 'OAuth2',
  //         user: 'horondisoftserve.devprojects@gmail.com',
  //         clientId: CLIENT_ID,
  //         clientSecret: CLIENT_SECRET,
  //         refreshToken: REFRESH_TOKEN,
  //         accessToken: accessToken
  //       },
  //     });

  //     const isCorrect = await transport.verify(function (error, success) {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log("Server is ready to take our messages");
  //       }
  //     });

  //     console.log("isCorrect:", isCorrect);

  //     const result = await transport.sendMail({
  //       from: MAIL_USER,
  //       to: "wasya1212cool@gmail.com",
  //       subject: 'templateInfo.subject',
  //       html: 'ou hi marv',
  //       text: 'hello world'
  //     });

  //     console.log(result);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // checkConnection = () => (new Promise((resolve, reject) => {
  //   this.connection.connect();

  //   this.connection.on('connect', () => {
  //     this.closeConnection();
  //     resolve(true);
  //   });

  //   this.connection.on('error', err => {
  //     this.closeConnection();
  //     reject(err);
  //   });
  // }));

  // checkConnection() {
  //   const transporter = nodemailer.createTransport({
  //     service: GMAIL_EMAIL_SERVICE,
  //     host: MAIL_HOST,
  //     port: MAIL_PORT,
  //     secure: true,
  //     auth: {
  //       type: 'OAuth2',
  //       user: 'MAIL_USER',
  //       clientId: '194565432193-ps1okm3l98uqr0a811vvedqee598af0l.apps.googleusercontent.com',
  //       clientSecret: 'GEzDnnyRQbL5L5_UNU_ovCcT',
  //       accessToken: 'AIzaSyDFhTTKs6Fp569N-US83qzqgHaJ1QraB2Y',
  //       refreshToken: '1//04nyKT6HFNZQzCgYIARAAGAQSNwF-L9IrXg8Ruav4gwBAbcf60mtXAAPExAmLawlc2jXZb8LpgmyXe3kpyWlCYRrz2V92GNdq0_o',
  //       accessToken: 'ya29.a0ARrdaM-SmVStA9Zlr0aJxdmXBEaFHfUhE3IJlvQnqXRoGruVNzS9ssjEQFwaaWq8HD5AfV290Kzyr_MfLsEIUhn3Orf6qLuYD_vd022y-OHLhXLOc_UBFz3YZ3wwNWfHBYDhGTQwNlfKQqZcG5O8QMeO67lf'
  //     },
  //   });

  //   transporter.sendMail({
  // from: MAIL_USER,
  // to: "wasya1212cool@gmail.com",
  // subject: 'templateInfo.subject',
  // html: 'fsdfsdfsdf',
  //   });
  // }

  // closeConnection() {
  //   this.connection.quit();
  // }
}

module.exports = Mailer;
