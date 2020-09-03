const nodemailer = require('nodemailer');
const { EMAIL_ERROR } = require('../error-messages/user.messages');

const sendEmail = async message => new Promise(resolve => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
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
