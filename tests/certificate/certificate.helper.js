const { gql } = require('@apollo/client');

const generateCertificate = async (certificateDada, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($certificateDada: GenerateCertificateInput!) {
        generateCertificate(newCertificate: $certificateDada) {
          ... on Certificate {
            _id
            name
            isExpired
            dateStart
            email
            isUsed
            ownedBy {
              _id
            }
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      certificateDada,
    },
  });

  return result.data.generateCertificate;
};

const getAllCertificates = async operations => {
  const result = await operations.query({
    query: gql`
      query {
        getAllCertificates(skip: 0, limit: 3) {
          ... on PaginatedCertificate {
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
      }
    `,
  });

  return result.data.getAllCertificates;
};
const getCertificateById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query($id: ID!) {
        getCertificateById(id: $id) {
          ... on Certificate {
            _id
            name
            isExpired
            isUsed
            value
            email
            ownedBy {
              _id
            }
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

  return result.data.getCertificateById;
};

const addCertificate = async (certificateName, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($certificateName: String!) {
        addCertificate(name: $certificateName) {
          ... on Certificate {
            _id
            name
            ownedBy {
              _id
            }
            email
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      certificateName,
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
            isExpired
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
  const result = await operations.mutate({
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

  return result.data.deleteCertificate;
};

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
  addCertificate,
  deleteCertificate,
  generateCertificate,
  getAllCertificates,
  getCertificateById,
  registerUser,
  updateCertificate,
};
