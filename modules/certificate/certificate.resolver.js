const certificatesService = require('./certificate.service');
const RuleError = require('../../errors/rule.error');

const certificatesQuery = {
  getAllCertificates: (parent, { skip, limit }, { user }) =>
    certificatesService.getAllCertificates(skip, limit, user),

  getCertificateById: async (parent, { id }) => {
    try {
      return await certificatesService.getCertificateById(id);
    } catch (e) {
      return new RuleError(e.message, e.statusCode);
    }
  },
};

const certificatesMutation = {
  addCertificate: async (
    parent,
    { certificate: { name, value } },
    { user }
  ) => {
    try {
      return await certificatesService.addCertificate(name, value, user.id);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
  deleteCertificate: async (parent, { id }) => {
    try {
      return await certificatesService.deleteCertificate(id);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },

  updateCertificate: async (parent, { id }) => {
    try {
      return await certificatesService.updateCertificate(id);
    } catch (error) {
      return new RuleError(error.message, error.statusCode);
    }
  },
};

module.exports = { certificatesQuery, certificatesMutation };
