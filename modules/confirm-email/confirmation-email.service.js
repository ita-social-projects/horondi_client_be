class ConfirmationEmailService {
  async confirmEmail(
    user,
    confirmationMessage,
    sendEmail,
    firstName,
    token,
    language
  ) {
    const message = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: '[HORONDI] Email confirmation',
      html: confirmationMessage(firstName, token, language),
    };

    await sendEmail(message);
  }
}

module.exports = new ConfirmationEmailService();
