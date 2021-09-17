const { and, allow } = require('graphql-shield');

const { hasRoles } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');
const { contactInputValidator } = require('../../validators/contact.validator');
const { inputDataValidation } = require('../../utils/rules');
const {
  INPUT_FIELDS: { CONTACT },
} = require('../../consts/input-fields');

const contactPermissionsQuery = {
  getContacts: allow,
  getContactById: allow,
};

const contactPermissionsMutations = {
  addContact: and(
    inputDataValidation(CONTACT, contactInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
  deleteContact: hasRoles([ADMIN, SUPERADMIN]),
  updateContact: and(
    inputDataValidation(CONTACT, contactInputValidator),
    hasRoles([ADMIN, SUPERADMIN])
  ),
};

module.exports = { contactPermissionsQuery, contactPermissionsMutations };
