const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');

const questionsAnswersMutation = {
  addQuestionsAnswers: hasRoles([SUPERADMIN, ADMIN]),
  deleteQuestionsAnswers: hasRoles([SUPERADMIN, ADMIN]),
  updateQuestionsAnswers: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { questionsAnswersMutation };
