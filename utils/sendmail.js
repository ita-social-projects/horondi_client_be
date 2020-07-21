const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const passwordResetEmail = (text, firstName) => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 1.1rem;
  ">
    <h2>Hello ${firstName}</h2>
    <p>${text}</p>
    <p>Thank you</p>
  </div>
`;

const confirmationMessage = (firstName, token) => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 1.1rem;
  ">
    <h2>Hello, ${firstName}</h2>
    <p>Please confirm email</p>
    <a href=${process.env.FRONT_BASE_URI}confirmation/${token}>Confirm email</a> 
  </div>
`;

const sendEmail = async (message, callback) => {
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
      console.log(err);
      return err;
    }
    callback();
    transporter.close();
  });
};

module.exports = {
  passwordResetEmail,
  transport,
  sendEmail,
  confirmationMessage,
};
