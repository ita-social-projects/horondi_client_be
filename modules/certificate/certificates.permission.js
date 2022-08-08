const { and } = require('graphql-shield');
const {
  hasRoles,
  isAuthorized,
  isUnlocked,
  inputDataValidation,
} = require('../../utils/rules');
const {
  certificateInputValidator,
  certificateNameValidator,
} = require('../../validators/certificate.validator');

const {
  roles: { USER, ADMIN, SUPERADMIN },
} = require('../../consts');

const {
  INPUT_FIELDS: { CERTIFICATE },
} = require('../../consts/input-fields');

const certificatePermissionsQuery = {
  getCertificateById: hasRoles([ADMIN, SUPERADMIN]),
  getAllCertificates: and(isAuthorized, isUnlocked),
};

const certificatePermissionsMutations = {
  generateCertificate: inputDataValidation(
    CERTIFICATE,
    certificateInputValidator
  ),

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
