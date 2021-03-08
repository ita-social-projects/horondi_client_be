const nodemailer = require('nodemailer');
const path = require('path');
const EmailTemplates = require('email-templates');
const {
  EMAIL_ERROR,
  TEMPLATE_NOT_FOUND,
} = require('../../error-messages/user.messages');
const {
  MAIL_USER,
  MAIL_PASS,
  FRONT_BASE_URI,
} = require('../../dotenvValidator');
const { htmlTemplates } = require('../../email-templates');
const { STATUS_CODES } = require('../../consts/status-codes');

const contextExtension = {
  frontendUrl: FRONT_BASE_URI,
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const emailTemplates = new EmailTemplates({
  message: {},
  views: {
    root: path.resolve(__dirname, '../../', 'email-templates'),
  },
});
class EmailService {
  async sendEmail(email, action, context = {}) {
    const templateInfo = htmlTemplates[action];

    if (!templateInfo) {
      throw new Error(STATUS_CODES.NOT_FOUND, TEMPLATE_NOT_FOUND);
    }
    Object.assign(context, contextExtension);

    const html = await emailTemplates.render(
      templateInfo.templateFileName,
      context
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

/*import {createTransport} from 'nodemailer';
import {resolve} from 'path';
import * as EmailTemplates from 'email-templates';

import {EmailActions, ResponseStatusCodeEnum, TokenActionEnum} from '../../constant';
import {config} from '../../config';
import {htmlTemplates} from '../../email-template';
import {ErrorHandler} from '../../errors';

if (
  !config.FRONTEND_URL
    || !config.ROOT_EMAIL_SERVICE
    || !config.ROOT_EMAIL
    || !config.ROOT_EMAIL_PASSWORD
) {
  throw Error('Root email credentials are not defined!');
}

const contextExtension = {
  frontendUrl: config.FRONTEND_URL
};

const transporter = createTransport({
  service: config.ROOT_EMAIL_SERVICE,
  auth: {
    user: config.ROOT_EMAIL,
    pass: config.ROOT_EMAIL_PASSWORD
  }
});

const emailTemplates = new EmailTemplates({
  message: {},
  views: {
    root: resolve(__dirname, '../../', 'email-template')
  }
});

export class MailService {
  async sendEmail(email: string, action: TokenActionEnum | EmailActions, context: any = {}): Promise<void> {
    const templateInfo = htmlTemplates[action];

    if (!templateInfo) {
      throw new ErrorHandler(ResponseStatusCodeEnum.SERVER_ERROR, 'Template not found (');
    }

    Object.assign(context, contextExtension);

    const html = await emailTemplates.render(templateInfo.templateFileName, context);

    await transporter.sendMail({
      from: `GAME LOAN 🎮 <${config.ROOT_EMAIL}>`,
      to: email,
      subject: templateInfo.subject,
      html
    });
  }
}

export const emailService = new MailService();*/
