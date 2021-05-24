const { allow, and } = require('graphql-shield');
const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const { newsInputValidator } = require('../../validators/news.validator');
const { inputDataValidation } = require('../../utils/rules');

const {
  DB_COLLECTIONS_NAMES: { NEWS },
} = require('../../consts/db-collections-names');

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
