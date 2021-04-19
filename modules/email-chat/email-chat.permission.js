const { hasRoles, isAuthorized } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const currencyMutation = {
  addEmailQuestion: isAuthorized,
  makeEmailQuestionsSpam: hasRoles([SUPERADMIN, ADMIN]),
  answerEmailQuestion: hasRoles([SUPERADMIN, ADMIN]),
  deleteEmailQuestions: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { currencyMutation };
