/* const { allow } = require('graphql-shield'); */

const { hasRoles, isTheSameUser } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const certificatePermissionsQuery = {
  getCertificateById: hasRoles([isTheSameUser, ADMIN, SUPERADMIN]),
  getAllCertificates: hasRoles([isTheSameUser, ADMIN, SUPERADMIN]),
};

/* hasRoles([ADMIN, SUPERADMIN]) */
const certificatePermissionsMutations = {
  updateCertificate: hasRoles([ADMIN, SUPERADMIN]),
  addCertificate: hasRoles([ADMIN, SUPERADMIN]),
  deleteCertificate: hasRoles([ADMIN, SUPERADMIN]),
};
module.exports = {
  certificatePermissionsMutations,
  certificatePermissionsQuery,
};
