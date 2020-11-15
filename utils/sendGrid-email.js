const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = require('../dotenvValidator');

sgMail.setApiKey(SENDGRID_API_KEY);
const sendEmail = msg => sgMail.send(msg);

module.exports = {
  sendEmail,
};
