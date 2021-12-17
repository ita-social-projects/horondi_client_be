const { TEMPLATE_NOT_FOUND } = require('../../error-messages/user.messages');
const { MAIL_USER } = require('../../dotenvValidator');
const RuleError = require('../../errors/rule.error');
const {
  contextExtension,
  transporter,
  emailTemplates,
} = require('../../utils/email-service');
const { htmlTemplates } = require('../../email-templates');
const {
  STATUS_CODES: { NOT_FOUND },
} = require('../../consts/status-codes');

class EmailService {
  async sendEmail(email, action, context = {}) {
    const { language } = context;
    const templateInfo = htmlTemplates[action];
    if (!templateInfo) {
      throw new RuleError(TEMPLATE_NOT_FOUND, NOT_FOUND);
    }

    Object.assign(context, contextExtension);
    const html = await emailTemplates.render(
      language
        ? templateInfo.templateFileName[0]
        : templateInfo.templateFileName[1],
      context,
    );

    await transporter.sendMail({
      from: MAIL_USER,
      to: email,
      subject: templateInfo.subject,
      html,
    });
  }
}

module.exports = new EmailService();
