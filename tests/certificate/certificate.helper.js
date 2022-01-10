const { gql } = require('@apollo/client');

const createCertificate = async (certificate, operations) => {
  const createdCertificate = await operations.mutate({
    mutation: gql`
      mutation($certificate: CertificateInput!, $upload: Upload) {
        addCertificate(certificate: $certificate, upload: $upload) {
          ... on Certificate {
            _id
            name {
              lang
              value
            }
            available
            code
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
      upload: '../___test__/model/dog.img',
    },
  });

  return createdCertificate.data.addCertificate;
};
const updateCertificate = async (id, certificate, operations) => {
  const updatedCertificate = await operations.mutate({
    mutation: gql`
      mutation($id: ID!, $certificate: CertificateInput!, $upload: Upload) {
        updateCertificate(id: $id, certificate: $certificate, upload: $upload) {
          ... on Certificate {
            _id
            name {
              lang
              value
            }
            available
            code
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
      certificate,
      upload: '../___test__/model/dog.img',
    },
  });

  return updatedCertificate.data.updateCertificate;
};
const getAllCategories = async operations => {
  const allCategories = await operations.query({
    query: gql`
      query {
        getAllCategories {
          items {
            _id
            code
            name {
              lang
              value
            }
            images {
              large
            }
            available
          }
          count
        }
      }
    `,
  });

  return allCategories.data.getAllCategories.items;
};
const getCertificateById = async (id, operations) => {
  const certificateById = await operations.query({
    query: gql`
      query($id: ID!) {
        getCertificateById(id: $id) {
          ... on Certificate {
            _id
            name {
              lang
              value
            }
            code
            available
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: { id },
  });

  return certificateById.data.getCertificateById;
};
const deleteCertificate = async (id, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        deleteCertificate(deleteId: $id, switchId: $id) {
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
  createCertificate,
  getAllCategories,
  getCertificateById,
  updateCertificate,
};
