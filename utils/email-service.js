const nodemailer = require('nodemailer');
const path = require('path');
const EmailTemplates = require('email-templates');
const {
  MAIL_USER,
  MAIL_PASS,
  FRONT_BASE_URI,
  GMAIL_EMAIL_SERVICE,
} = require('../dotenvValidator');

const contextExtension = {
  frontendUrl: FRONT_BASE_URI,
};

const transporter = nodemailer.createTransport({
  service: GMAIL_EMAIL_SERVICE,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const emailTemplates = new EmailTemplates({
  message: {},
  views: {
    root: path.resolve(__dirname, '../', 'email-templates'),
  },
});

module.exports = {
  contextExtension,
  transporter,
  emailTemplates,
};
