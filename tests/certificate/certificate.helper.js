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
            createdBy {
              _id
            }
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

const updateCertificate = async (name, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($name: String!) {
        updateCertificate(name: $name) {
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
      name,
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

const generateCertificate = value => value;

const registerUser = async (user, operations) => {
  const registeredUser = await operations.mutate({
    mutation: gql`
      mutation($user: userRegisterInput!) {
        registerUser(user: $user, language: 1) {
          _id
          firstName
          lastName
          invitationalToken
          refreshToken
          email
          role
          registrationDate
          credentials {
            tokenPass
          }
        }
      }
    `,
    variables: {
      user,
    },
  });
  return registeredUser;
};

module.exports = {
  deleteCertificate,
  addCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
  registerUser,
  generateCertificate,
};
