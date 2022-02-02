const { and } = require('graphql-shield');
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
  updateCertificate: inputDataValidation('name', certificateNameValidator),

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
