const { gql } = require('@apollo/client');

const generateCertificate = async (certificateData, email, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation (
        $certificateData: [GenerateCertificateInput]!
        $email: String!
      ) {
        generateCertificate(newCertificates: $certificateData, email: $email) {
          ... on Certificates {
            certificates {
              _id
              name
            }
            certificatesPrice
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      certificateData,
      email,
    },
  });

  return result.data.generateCertificate;
};

const getAllCertificates = async (search, status, operations) => {
  const result = await operations.query({
    query: gql`
      query ($search: String, $status: [String]) {
        getAllCertificates(
          skip: 0
          limit: 3
          search: $search
          status: $status
        ) {
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
    variables: {
      search,
      status,
    },
  });

  return result.data.getAllCertificates;
};

const getAllUserCertificates = async operations => {
  const result = await operations.query({
    query: gql`
      query {
        getAllUserCertificates(skip: 0, limit: 3) {
          __typename
          ... on PaginatedCertificate {
            items {
              _id
              name
              value
              ownedBy {
                _id
              }
            }
            count
          }
        }
      }
    `,
  });

  return result.data.getAllUserCertificates;
};

const getCertificateById = async (id, operations) => {
  const result = await operations.query({
    query: gql`
      query ($id: ID!) {
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

const getCertificateByParams = async (params, operations) => {
  const result = await operations.query({
    query: gql`
      query ($params: CertificateInput!) {
        getCertificateByParams(params: $params) {
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
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      params,
    },
  });

  return result;
};

const addCertificate = async (certificateName, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation ($certificateName: String!) {
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

const updateCertificate = async (params, statusUpdate, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation ($params: CertificateInput!, $statusUpdate: String) {
        updateCertificate(params: $params, statusUpdate: $statusUpdate) {
          ... on Certificate {
            _id
            isUsed
            isExpired
            dateOfUsing
            inProgress
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      params,
      statusUpdate,
    },
  });

  return result.data.updateCertificate;
};

const giftCertificateToEmail = async (
  id,
  email,
  oldEmail,
  language,
  operations
) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation (
        $id: ID!
        $email: String!
        $oldEmail: String!
        $language: Int!
      ) {
        giftCertificateToEmail(
          id: $id
          email: $email
          oldEmail: $oldEmail
          language: $language
        ) {
          __typename
          ... on Certificate {
            email
          }
          ... on Error {
            statusCode
            message
          }
        }
      }
    `,
    variables: {
      oldEmail,
      id,
      email,
      language,
    },
  });

  return result.data.giftCertificateToEmail;
};

const deleteCertificate = async (id, adminId, operations) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation ($id: ID!, $adminId: ID!) {
        deleteCertificate(id: $id, adminId: $adminId) {
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
      adminId,
    },
  });

  return result.data.deleteCertificate;
};

const registerUser = async (user, operations) => {
  const registeredUser = await operations.mutate({
    mutation: gql`
      mutation ($user: userRegisterInput!) {
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
  getAllUserCertificates,
  getCertificateById,
  getCertificateByParams,
  registerUser,
  updateCertificate,
  giftCertificateToEmail,
};
