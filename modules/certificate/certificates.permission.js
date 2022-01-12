const { hasRoles } = require('../../utils/rules');
const {
  roles: { USER, ADMIN, SUPERADMIN },
} = require('../../consts');

const certificatePermissionsQuery = {
  getCertificateById: hasRoles([USER, ADMIN, SUPERADMIN]),
  getAllCertificates: hasRoles([USER, ADMIN, SUPERADMIN]),
};

const certificatePermissionsMutations = {
  updateCertificate: hasRoles([USER, ADMIN, SUPERADMIN]),
  addCertificate: hasRoles([USER, ADMIN, SUPERADMIN]),
  deleteCertificate: hasRoles([ADMIN, SUPERADMIN]),
};
module.exports = {
  certificatePermissionsMutations,
  certificatePermissionsQuery,
};
