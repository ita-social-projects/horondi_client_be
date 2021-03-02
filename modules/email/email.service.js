const { MAIL_USER } = require('../../dotenvValidator');

class EmailService {
  async sendEmail({ user, sendEmail, subject, html }) {
    const message = {
      from: MAIL_USER,
      to: user.email,
      subject,
      html,
    };

    await sendEmail(message);
  }
}

module.exports = new EmailService();
