const { EmailActions } = require('../consts/email-actions');

const htmlTemplates = {
  [EmailActions.CONFIRM_EMAIL]: {
    subject: '[HORONDI] Email confirmation',
    templateFileName: ['confirm-email-en', 'confirm-email-ua'],
  },
  [EmailActions.RECOVER_PASSWORD]: {
    subject: '[HORONDI] Instructions for password recovery',
    templateFileName: ['recover-password-en', 'confirm-email-ua'],
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
    templateFileName: ['unlock-user-en', 'block-user-ua'],
  },
  [EmailActions.INCOMPLETE_OPERATIONS_CART]: {
    subject: '[HORONDI] Incomplete operations in cart',
    templateFileName: ['incomplete-operations-en', 'incomplete-operations-ua'],
  },
  [EmailActions.PRODUCT_AVAILABLE_AGAIN_WISHLIST]: {
    subject: '[HORONDI] Product in wishlist is available again',
    templateFileName: 'product-is-available-again',
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
};

module.exports = { htmlTemplates };
