const Mailer = require('../../utils/mailer');

const createMailer = (transportOptions, onError) =>
  new Mailer(transportOptions, onError);

const createTransport = async mailer => mailer.createTransport();

const sendMessage = async (mailer, messageOptions) =>
  mailer.sendMail(messageOptions);

const verifyConnection = async mailer => mailer.verifyConnection();

const reconnect = async mailer => {
  await mailer.reconnect();

  return mailer.transporter;
};

const closeConnection = mailer => {
  mailer.closeConnection();
};

module.exports = {
  Mailer,
  createTransport,
  reconnect,
  verifyConnection,
  sendMessage,
  createMailer,
  closeConnection,
};
