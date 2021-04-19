const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const emailChatQuestionMutation = {
  addCurrency: hasRoles([SUPERADMIN, ADMIN]),
  deleteCurrency: hasRoles([SUPERADMIN, ADMIN]),
  updateCurrency: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { emailChatQuestionMutation };
