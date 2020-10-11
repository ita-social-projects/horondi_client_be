class EmailService {
  async sendEmail({ user, sendEmail, subject, html }) {
    const message = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject,
      html,
    };

    await sendEmail(message);
  }
}

module.exports = new EmailService();
