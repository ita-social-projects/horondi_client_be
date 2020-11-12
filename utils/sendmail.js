const nodemailer = require('nodemailer');
const { EMAIL_ERROR } = require('../error-messages/user.messages');
const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
} = require('../dotenvValidator');

const sendEmail = async message =>
  new Promise(resolve => {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
    });
    transporter.sendMail(message, (err, info) => {
      if (err) {
        throw new Error(EMAIL_ERROR);
      }
      transporter.close();
      resolve(info);
    });
  });

module.exports = {
  sendEmail,
};
