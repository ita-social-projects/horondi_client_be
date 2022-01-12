const { gql } = require('@apollo/client');

const getAllCertificates = async operations => {
  const allCertificates = await operations.query({
    query: gql`
      query {
        getAllCertificates(skip: 0, limit: 3) {
          items {
            _id
            name
            value
            isUsed
            createdBy
          }
          count
        }
      }
    `,
  });

  return allCertificates.data.getAllCertificates;
};
const getCertificateById = async (id, operations) => {
  const certificateById = await operations.query({
    query: gql`
      query($id: ID!) {
        getCertificateById(id: $id) {
          ... on Certificate {
            _id
            name
            isActive
            value
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return certificateById.data.getCertificateById;
};

const addCertificate = async (certificate, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($certificate: CertificateInput!) {
        addCertificate(certificate: $certificate) {
          ... on Certificate {
            _id
            name
            isActive
            isUsed
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      certificate,
    },
  });

  return result.data.addCertificate;
};

const updateCertificate = async (id, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        updateCertificate(id: $id) {
          ... on Certificate {
            _id
            isUsed
            isActive
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return result.data.updateCertificate;
};

const deleteCertificate = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteCertificate(id: $id) {
          ... on Certificate {
            _id
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      id,
    },
  });
  return res.data.deleteCertificate;
};

module.exports = {
  deleteCertificate,
  addCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
};
