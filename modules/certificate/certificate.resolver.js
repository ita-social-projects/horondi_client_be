const certificatesService = require('./certificate.service');
const RuleError = require('../../errors/rule.error');

const tryCatchWrapper = async func => {
  try {
    return func;
  } catch (e) {
    return new RuleError(e.message, e.statusCode);
  }
};

const certificatesQuery = {
  getAllCertificates: async (_, { skip, limit }, { user }) =>
    tryCatchWrapper(certificatesService.getAllCertificates(skip, limit, user)),

  getCertificateById: async (_, { id }) =>
    tryCatchWrapper(certificatesService.getCertificateById(id)),
};

const certificatesMutation = {
  addCertificate: async (_, { certificate: { name, value } }, { user }) =>
    tryCatchWrapper(certificatesService.addCertificate(name, value, user.id)),

  deleteCertificate: async (_, { id }) =>
    tryCatchWrapper(certificatesService.deleteCertificate(id)),

  updateCertificate: async (_, { id, name }) =>
    tryCatchWrapper(certificatesService.updateCertificate(id || name)),
};

module.exports = { certificatesQuery, certificatesMutation };
