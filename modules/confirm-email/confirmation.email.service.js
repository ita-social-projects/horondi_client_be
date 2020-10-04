class ConfirmationEmailService {
  async confirmEmail(
    confirmationMessage,
    sendEmail,
    firstName,
    token,
    savedUser
  ) {
    const message = {
      from: process.env.MAIL_USER,
      to: savedUser.email,
      subject: '[HORONDI] Email confirmation',
      html: confirmationMessage(firstName, token, language),
    };

    await sendEmail(message);
  }
}

module.exports = new ConfirmationEmailService();
