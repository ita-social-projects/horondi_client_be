const { hasRoles } = require('../../utils/rules');
const { and } = require('graphql-shield');
const {
  businessTextValidator,
} = require('../../validators/business-text.validator');
const { inputDataValidation } = require('../../utils/rules');
const {
  roles: { SUPERADMIN, ADMIN },
} = require('../../consts');
const {
  DB_COLLECTIONS_NAMES: { BUSINESS_TEXT },
} = require('../../consts/db-collections-names');

const businessTextMutation = {
  addBusinessText: and(
    inputDataValidation(BUSINESS_TEXT, businessTextValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteBusinessText: hasRoles([SUPERADMIN, ADMIN]),
  updateBusinessText: and(
    inputDataValidation(BUSINESS_TEXT, businessTextValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = { businessTextMutation };
