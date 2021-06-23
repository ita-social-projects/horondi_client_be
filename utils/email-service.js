const nodemailer = require('nodemailer');
const path = require('path');
const EmailTemplates = require('email-templates');
const {
  MAIL_USER,
  MAIL_PASS,
  MAIL_HOST,
  MAIL_PORT,
  ADMIN_BASE_URI,
  FRONT_BASE_URI,
  GMAIL_EMAIL_SERVICE,
} = require('../dotenvValidator');

const contextExtension = {
  frontendUrl: FRONT_BASE_URI,
  adminUrl: ADMIN_BASE_URI,
};

const transporter = nodemailer.createTransport({
  service: GMAIL_EMAIL_SERVICE,
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
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
