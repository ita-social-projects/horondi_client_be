const { ApolloError } = require('apollo-server');
const certificatesService = require('./certificate.service');

const certificatesQuery = {
  getAllCertificates: async (
    _,
    {
      skip,
      limit,
      sortBy = 'startDate',
      sortOrder = 'desc',
      search = '',
      status = [],
    }
  ) =>
    certificatesService.getAllCertificates(
      skip,
      limit,
      sortBy,
      sortOrder,
      search,
      status
    ),

  getAllUserCertificates: async (_, { skip, limit }, { user }) =>
    certificatesService.getAllUserCertificates(skip, limit, user),

  getCertificateById: async (_, { id }) =>
    certificatesService.getCertificateById(id),

  getCertificateByParams: async (_, { params }) => {
    try {
      return await certificatesService.getCertificateByParams(params);
    } catch (e) {
      return new ApolloError(e.message, e.statusCode);
    }
  },
};

const certificatesMutation = {
  generateCertificate: async (
    _,
    { newCertificates, email, dateStart },
    { user = {} }
  ) =>
    certificatesService.generateCertificate(
      newCertificates,
      email,
      dateStart,
      user._id,
      user.role
    ),

  addCertificate: async (_, { name }, { user = {} }) =>
    certificatesService.addCertificate(name, user._id, user.email),

  deleteCertificate: async (_, { id, adminId }) =>
    certificatesService.deleteCertificate(id, adminId),

  updateCertificate: async (_, { params, statusUpdate }) =>
    certificatesService.updateCertificate(params, statusUpdate),

  giftCertificateToEmail: async (_, { id, email, oldEmail, language }) =>
    certificatesService.giftCertificateToEmail(id, email, oldEmail, language),
};

module.exports = { certificatesQuery, certificatesMutation };
