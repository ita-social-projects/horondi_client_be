const { and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');
const {
  questionInputValidator,
  answerInputValidator,
} = require('../../validators/email-question.validator');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { QUESTION, TEXT },
} = require('../../consts/input-fields');

const emailChatQuestionQuery = {
  getAllEmailQuestions: hasRoles([SUPERADMIN, ADMIN]),
  getPendingEmailQuestionsCount: hasRoles([SUPERADMIN, ADMIN]),
  getEmailQuestionById: hasRoles([SUPERADMIN, ADMIN]),
};

const emailChatQuestionMutation = {
  addEmailQuestion: inputDataValidation(QUESTION, questionInputValidator),
  makeEmailQuestionsSpam: hasRoles([SUPERADMIN, ADMIN]),
  answerEmailQuestion: and(
    inputDataValidation(TEXT, answerInputValidator),
    hasRoles([SUPERADMIN, ADMIN])
  ),
  deleteEmailQuestions: hasRoles([SUPERADMIN, ADMIN]),
};

module.exports = { emailChatQuestionMutation, emailChatQuestionQuery };
