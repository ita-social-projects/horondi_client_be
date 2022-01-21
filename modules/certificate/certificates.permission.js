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
    inputDataValidation('name', certificateNameValidator),
    allow
  ),
  addCertificate: and(
    hasRoles([USER]),
    inputDataValidation('name', certificateNameValidator)
  ),
  deleteCertificate: hasRoles([ADMIN, SUPERADMIN]),
};

module.exports = {
  certificatePermissionsMutations,
  certificatePermissionsQuery,
};
