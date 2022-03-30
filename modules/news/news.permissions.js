const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');

const { newsInputValidator } = require('../../validators/news.validator');
const { inputDataValidation } = require('../../utils/rules');

const {
  INPUT_FIELDS: { NEWS },
} = require('../../consts/input-fields');

const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;

const newsPermissionsQuery = {
  getAllNews: allow,
  getNewsById: allow,
};

const newsPermissionsMutations = {
  addNews: and(
    inputDataValidation(NEWS, newsInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteNews: hasRoles([ADMIN, SUPERADMIN]),
  updateNews: and(
    inputDataValidation(NEWS, newsInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = { newsPermissionsQuery, newsPermissionsMutations };
