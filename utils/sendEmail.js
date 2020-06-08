const nodemailer = require('nodemailer');
require('dotenv').config();

const SmtpPool = require('nodemailer/lib/smtp-pool');

const sendEmail = async (message, callback) => {
  const transporter = nodemailer.createTransport(
    new SmtpPool({
      host: 'smtp-mail.outlook.com',
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
      auth: {
        user: 'exzzemple.sender@outlook.com',
        pass: `i"+Mv!;8vV<PN9t`,
      },
    })
  );

  transporter.sendMail(message, (err, info) => {
    if (err) {
      return err;
    }
    callback();
    transporter.close();
  });
};

module.exports = sendEmail;
