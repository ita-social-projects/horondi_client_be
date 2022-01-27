const { and, allow } = require('graphql-shield');
const {
  hasRoles,
  isAuthorized,
  isUnlocked,
  inputDataValidation,
} = require('../../utils/rules');
const {
  certificateNameValidator,
} = require('../../validators/certificate.validator');

const {
  roles: { USER, ADMIN, SUPERADMIN },
} = require('../../consts');

const certificatePermissionsQuery = {
  getCertificateById: hasRoles([ADMIN, SUPERADMIN]),

  getAllCertificates: and(isAuthorized, isUnlocked),
};

const certificatePermissionsMutations = {
  updateCertificate: and(
    allow,
    inputDataValidation('name', certificateNameValidator)
  ),

  addCertificate: and(
    hasRoles([USER]),
    inputDataValidation('name', certificateNameValidator)
  ),

  deleteCertificate: hasRoles([ADMIN, SUPERADMIN]),

  generateCertificate: allow,
};

module.exports = {
  certificatePermissionsMutations,
  certificatePermissionsQuery,
};
