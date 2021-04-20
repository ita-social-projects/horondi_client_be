const { hasRoles, isAuthorized } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const emailChatQuestionQuery = {
  getAllEmailQuestions: hasRoles([SUPERADMIN, ADMIN]),
  getPendingEmailQuestionsCount: hasRoles([SUPERADMIN, ADMIN]),
  getEmailQuestionById: hasRoles([SUPERADMIN, ADMIN]),
};

const emailChatQuestionMutation = {
  addEmailQuestion: isAuthorized,
  makeEmailQuestionsSpam: hasRoles([SUPERADMIN, ADMIN]),
  answerEmailQuestion: hasRoles([SUPERADMIN, ADMIN]),
  deleteEmailQuestions: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { emailChatQuestionMutation, emailChatQuestionQuery };
