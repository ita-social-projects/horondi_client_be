const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendEmail = msg => sgMail.send(msg);

module.exports = {
  sendEmail,
};
