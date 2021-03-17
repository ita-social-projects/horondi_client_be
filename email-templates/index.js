const { EmailActions } = require('../consts/email-actions');

const htmlTemplates = {
  [EmailActions.CONFIRM_EMAIL]: {
    subject: '[HORONDI] Email confirmation',
    templateFileName: 'confirm-email',
  },
  [EmailActions.RECOVER_PASSWORD]: {
    subject: '[HORONDI] Instructions for password recovery',
    templateFileName: 'recover-password',
  },
  [EmailActions.SUCCESSFUL_CONFIRM]: {
    subject: '[HORONDI] Successful email confirmation',
    templateFileName: 'successful-confirm',
  },
  [EmailActions.BLOCK_USER]: {
    subject: '[HORONDI] Blocked user',
    templateFileName: 'block-user',
  },
  [EmailActions.UNLOCK_USER]: {
    subject: '[HORONDI] Unlocked user',
    templateFileName: 'unlock-user',
  },
  [EmailActions.INCOMPLETE_OPERATIONS_CART]: {
    subject: '[HORONDI] Incomplete operations in cart',
    templateFileName: 'incomplete-operations',
  },
  [EmailActions.SUCCESSFUL_ORDER]: {
    subject: '[HORONDI] Successful made order',
    templateFileName: 'successful-order',
  },
  [EmailActions.CONFIRM_ADMIN_EMAIL]: {
    subject: '[HORONDI] Invitation to become an admin',
    templateFileName: 'confirm-admin-email',
  },
};

module.exports = { htmlTemplates };
