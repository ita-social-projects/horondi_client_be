const { or, allow } = require('graphql-shield');

const { isTheSameUser, hasRoles } = require('../../utils/rules');
const { roles } = require('../../consts');

const { ADMIN, SUPERADMIN } = roles;

const contactPermissionsQuery = {
  getContacts: allow,
  getContactById: allow,
};

const contactPermissionsMutations = {
  addContact: hasRoles([ADMIN, SUPERADMIN]),
  deleteContact: hasRoles([ADMIN, SUPERADMIN]),
  updateContact: or(isTheSameUser, hasRoles([ADMIN, SUPERADMIN])),
};

module.exports = { contactPermissionsQuery, contactPermissionsMutations };
