const certificatesService = require('./certificate.service');

const { tryCatchWrapper } = require('../helper-functions');

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

  updateCertificate: async (_, { name }) =>
    tryCatchWrapper(certificatesService.updateCertificate(name)),
};

module.exports = { certificatesQuery, certificatesMutation };
