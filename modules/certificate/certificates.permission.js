const { and } = require('graphql-shield');
const { hasRoles, isAuthorized, isUnlocked } = require('../../utils/rules');
const {
  roles: { USER, ADMIN, SUPERADMIN },
} = require('../../consts');

const certificatePermissionsQuery = {
  getCertificateById: hasRoles([ADMIN, SUPERADMIN]),
  getAllCertificates: and(isAuthorized, isUnlocked),
};

const certificatePermissionsMutations = {
  updateCertificate: hasRoles([USER, ADMIN, SUPERADMIN]),
  addCertificate: hasRoles([USER, ADMIN, SUPERADMIN]), // пермішен тільки в незаблокованого юзера!
  deleteCertificate: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  certificatePermissionsMutations,
  certificatePermissionsQuery,
};
