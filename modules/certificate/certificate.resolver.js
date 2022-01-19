const certificatesService = require('./certificate.service');

const Certificate = require('./certificate.model');

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

  testDirect: async (_, { name }) =>
    tryCatchWrapper(async () => {
      const updatedCertificate = await Certificate.findOneAndUpdate(
        { name },
        { isUsed: true },
        { new: true }
      ).exec();

      if (!updatedCertificate) {
        throw new Error('CERTIFICATE_NOT_FOUND', '404');
      }

      return updatedCertificate;
    }),
};

module.exports = { certificatesQuery, certificatesMutation };
