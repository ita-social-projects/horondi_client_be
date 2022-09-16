const { EmailActions } = require('../consts/email-actions');

const htmlTemplates = {
  [EmailActions.CONFIRM_EMAIL]: {
    subject: '[HORONDI] Email confirmation',
    templateFileName: ['confirm-email-en', 'confirm-email-ua'],
  },
  [EmailActions.RECOVER_PASSWORD]: {
    subject: '[HORONDI] Instructions for password recovery',
    templateFileName: ['recover-password-en', 'recover-password-ua'],
  },
  [EmailActions.SUCCESSFUL_CONFIRM]: {
    subject: '[HORONDI] Successful email confirmation',
    templateFileName: ['successful-confirm-en', 'confirm-email-ua'],
  },
  [EmailActions.BLOCK_USER]: {
    subject: '[HORONDI] Blocked user',
    templateFileName: ['block-user-en', 'block-user-ua'],
  },
  [EmailActions.UNLOCK_USER]: {
    subject: '[HORONDI] Unlocked user',
    templateFileName: ['unlock-user-en', 'unlock-user-ua'],
  },
  [EmailActions.SUCCESSFUL_ORDER]: {
    subject: '[HORONDI] Successful made order',
    templateFileName: ['successful-order-en', 'successful-order-ua'],
  },
  [EmailActions.CONFIRM_ADMIN_EMAIL]: {
    subject: '[HORONDI] Invitation to become an admin',
    templateFileName: ['confirm-admin-email-en', 'confirm-admin-email-ua'],
  },
  [EmailActions.PAYMENT_ORDER]: {
    subject: '[HORONDI] Pay for your order',
    templateFileName: ['payment-order-en', 'payment-order-ua'],
  },
  [EmailActions.CONFIRM_CREATION_SUPERADMIN_EMAIL]: {
    subject: '[HORONDI] Confirmation creating superadmin',
    templateFileName: [
      'confirm-creation-superadmin-email-en',
      'confirm-creation-superadmin-email-ua',
    ],
  },
  [EmailActions.SEND_EMAIL_ANSWER]: {
    subject: '[HORONDI] Your question has been answered',
    templateFileName: ['answer-email-question-en', 'answer-email-question-ua'],
  },
  [EmailActions.CERTIFICATE_REMINDER]: {
    subject: '[HORONDI] Certificate reminder',
    templateFileName: ['certificate-reminder-en', 'certificate-reminder-ua'],
  },
  [EmailActions.CERTIFICATE_EMAIL]: {
    subject: '[HORONDI] Your certificate',
    templateFileName: [
      'certificate-user-purchased-email-en',
      'certificate-user-purchased-email-ua',
    ],
  },
  [EmailActions.SEND_GIFT_CERTIFICATE]: {
    subject: '[HORONDI] Certificate has been gifted',
    templateFileName: ['send-gift-certificate-en', 'send-gift-certificate-ua'],
  },
  [EmailActions.RECEIVE_GIFT_SERTIFICATE]: {
    subject: '[HORONDI] Gift Certificate',
    templateFileName: [
      'reсive-gift-certificate-en',
      'reсive-gift-certificate-ua',
    ],
  },
};

module.exports = { htmlTemplates };
