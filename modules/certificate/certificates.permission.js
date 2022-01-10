const { allow } = require('graphql-shield');

const { hasRoles, isTheSameUser } = require('../../utils/rules');
const {
  roles: { ADMIN, SUPERADMIN },
} = require('../../consts');

const certificatePermissionsQuery = {
  getCertificateById: allow,
  getAllCertificates: allow,
};

/* hasRoles([ADMIN, SUPERADMIN]) */
const certificatePermissionsMutations = {
  updateCertificate: allow,
  addCertificate: allow,
  deleteCertificate: hasRoles([isTheSameUser, ADMIN, SUPERADMIN]),

  /* hasRoles([isTheSameUser,ADMIN, SUPERADMIN]) */
};

module.exports = {
  certificatePermissionsMutations,
  certificatePermissionsQuery,
};
