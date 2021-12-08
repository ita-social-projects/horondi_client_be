const { gql } = require('@apollo/client');

const registerUser = async (
  firstName,
  lastName,
  email,
  pass,
  language,
  operations
) => {
  const registeredUser = await operations.mutate({
    mutation: gql`
      mutation(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $language: Int!
      ) {
        registerUser(
          user: {
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
          }
          language: $language
        ) {
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
      firstName,
      lastName,
      email,
      password: pass,
      language,
    },
  });
  return registeredUser;
};
const updateUserById = async (
  userId,
  email,
  role,
  phoneNumber,
  country,
  city,
  street,
  buildingNumber,
  orders,
  comments,
  token,
  operations
) => {
  const updatedUser = await operations.mutate({
    mutation: gql`
      mutation(
        $userId: ID!
        $email: String!
        $phoneNumber: String!
        $country: String!
        $city: String!
        $street: String!
        $buildingNumber: String!
        $orders: [ID!]!
        $comments: [ID!]!
      ) {
        updateUserById(
          user: {
            firstName: "Updated"
            lastName: "Updated"
            email: $email
            phoneNumber: $phoneNumber
            address: {
              country: $country
              city: $city
              street: $street
              buildingNumber: $buildingNumber
            }
            orders: $orders
            comments: $comments
          }
          id: $userId
        ) {
          firstName
          lastName
          email
          phoneNumber
          role
          address {
            country
            city
            street
            buildingNumber
          }
          orders
          comments
        }
      }
    `,
    context: {
      headers: {
        token,
      },
    },
    variables: {
      userId,
      email,
      role,
      phoneNumber,
      country,
      city,
      street,
      buildingNumber,
      orders,
      comments,
    },
  });

  return updatedUser;
};
const loginUser = async (email, pass, rememberMe, operations) => {
  const loginedUser = await operations.mutate({
    mutation: gql`
      mutation($email: String!, $password: String!, $rememberMe: Boolean) {
        loginUser(
          loginInput: {
            email: $email
            password: $password
            rememberMe: $rememberMe
          }
        ) {
          token
          firstName
          lastName
          comments
          _id
          email
          role
          password
          phoneNumber
          confirmationToken
          recoveryToken
          address {
            zipcode
            buildingNumber
            region
            street
            city
            appartment
            country
          }
          registrationDate
          credentials {
            source
            tokenPass
          }
        }
      }
    `,
    variables: {
      email,
      password: pass,
      rememberMe,
    },
  });
  return loginedUser;
};
const googleUser = async (idToken, rememberMe, operations) => {
  const googleUser = await operations.mutate({
    mutation: gql`
      mutation($idToken: String!, $rememberMe: Boolean) {
        googleUser(idToken: $idToken, rememberMe: $rememberMe) {
          token
          _id
        }
      }
    `,
    variables: {
      idToken,
      rememberMe,
    },
  });
  return googleUser.data.googleUser;
};
const facebookUser = async (idToken, rememberMe, operations) => {
  const facebookUser = await operations.mutate({
    mutation: gql`
      mutation($idToken: String!, $rememberMe: Boolean) {
        facebookUser(idToken: $idToken, rememberMe: $rememberMe) {
          token
          _id
        }
      }
    `,
    variables: {
      idToken,
      rememberMe,
    },
  });
  return facebookUser.data.facebookUser;
};
const regenerateAccessToken = async (refreshToken, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($refreshToken: String!) {
        regenerateAccessToken(refreshToken: $refreshToken) {
          ... on Token {
            token
            refreshToken
            accessToken
          }
        }
      }
    `,
    variables: {
      refreshToken,
    },
  });
  return res.data.regenerateAccessToken;
};
const getAllUsers = async operations => {
  const allUsers = await operations.query({
    query: gql`
      query {
        getAllUsers {
          items {
            firstName
            lastName
            email
            phoneNumber
            role
            address {
              country
              city
              street
              buildingNumber
            }
            orders
            comments
          }
          count
        }
      }
    `,
  });

  return allUsers;
};
const getUserByToken = async operations => {
  const user = await operations.query({
    query: gql`
      query {
        getUserByToken {
          ... on User {
            firstName
            lastName
            email
            phoneNumber
            role
            address {
              country
              city
              street
              buildingNumber
            }
            orders
            comments
          }
          ... on Error {
            message
          }
        }
      }
    `,
  });

  return user;
};
const getUsersForStatistic = async (filter, operations) => {
  const res = await operations.query({
    query: gql`
      query($filter: UserForStatisticsInput) {
        getUsersForStatistic(filter: $filter) {
          ... on StatisticBar {
            labels
            counts
            total
          }
        }
      }
    `,
    variables: {
      filter,
    },
  });

  return res.data;
};
const getUserById = async (userId, operations) =>
  await operations.query({
    query: gql`
      query($userId: ID!) {
        getUserById(id: $userId) {
          _id
          firstName
          lastName
          email
          phoneNumber
          role
          address {
            country
            city
            street
            buildingNumber
          }
          orders
          comments
        }
      }
    `,
    variables: {
      userId,
    },
  });
const getPurchasedProducts = async (userId, operations) => {
  const res = await operations.query({
    query: gql`
      query($userId: ID!) {
        getPurchasedProducts(id: $userId) {
          _id
        }
      }
    `,
    variables: {
      userId,
    },
  });
  return res.data.getPurchasedProducts;
};
const deleteUser = async (userId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($userId: ID!) {
        deleteUser(id: $userId) {
          ... on User {
            _id
          }
        }
      }
    `,
    variables: {
      userId,
    },
  });
  return res;
};
const blockUser = async (userId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($userId: ID!) {
        blockUser(userId: $userId) {
          ... on User {
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
      userId,
    },
  });
  return res.data.blockUser;
};
const unlockUser = async (userId, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($userId: ID!) {
        unlockUser(userId: $userId) {
          ... on User {
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
      userId,
    },
  });
  return res.data.unlockUser;
};
const confirmUserEmail = async (token, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($token: String!) {
        confirmUserEmail(token: $token) {
          token
          refreshToken
          confirmed
        }
      }
    `,
    variables: {
      token,
    },
  });
  return res.data.confirmUserEmail;
};
const recoverUser = async (email, language, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($email: String!, $language: Int!) {
        recoverUser(email: $email, language: $language)
      }
    `,
    variables: {
      email,
      language,
    },
  });
  return res.data.recoverUser;
};

const resetPassword = async (password, token, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($password: String!, $token: String!) {
        resetPassword(password: $password, token: $token)
      }
    `,
    variables: {
      password,
      token,
    },
  });
  return res;
};

const checkIfTokenIsValid = async (token, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($token: String!) {
        checkIfTokenIsValid(token: $token)
      }
    `,
    variables: {
      token,
    },
  });
  return res;
};
const sendEmailConfirmation = async (email, language, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($email: String!, $language: Int!) {
        sendEmailConfirmation(email: $email, language: $language)
      }
    `,
    variables: {
      email,
      language,
    },
  });
  return res;
};
const resendEmailToConfirmAdmin = async (user, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($user: resendEmailToConfirmAdminInput!) {
        resendEmailToConfirmAdmin(user: $user) {
          ... on SuccessfulResponse {
            isSuccess
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      user,
    },
  });
  return res;
};
const confirmSuperadminCreation = async (user, operations) => {
  const res = await operations.mutate({
    mutation: gql`
      mutation($user: confirmSuperadminCreationInput!) {
        confirmSuperadminCreation(user: $user) {
          ... on SuccessfulResponse {
            isSuccess
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      user,
    },
  });
  return res;
};

const completeAdminRegister = async (
  token,
  firstName,
  lastName,
  password,
  operations
) => {
  const result = await operations.mutate({
    mutation: gql`
      mutation($user: AdminConfirmInput!, $token: String!) {
        completeAdminRegister(user: $user, token: $token) {
          ... on SuccessfulResponse {
            isSuccess
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      token,
      user: {
        firstName,
        lastName,
        password,
      },
    },
  });
  return result;
};
const switchUserStatus = async (userId, operations) =>
  await operations.mutate({
    mutation: gql`
      mutation($id: ID!) {
        switchUserStatus(id: $id) {
          ... on SuccessfulResponse {
            isSuccess
          }
          ... on Error {
            message
            statusCode
          }
        }
      }
    `,
    variables: {
      id: userId,
    },
  });
const loginAdmin = async (email, password, operations) =>
  await operations.mutate({
    mutation: gql`
      mutation($user: LoginInput!) {
        loginAdmin(loginInput: $user) {
          token
          _id
        }
      }
    `,
    variables: {
      user: {
        email,
        password,
      },
    },
  });
const getAllUsersWithToken = async (token, operations) =>
  await operations.query({
    query: gql`
      {
        getAllUsers {
          items {
            _id
            firstName
            lastName
            email
          }
        }
      }
    `,
    context: {
      headers: {
        token,
      },
    },
  });
const validateConfirmationToken = async (token, operations) =>
  await operations.query({
    query: gql`
      query($token: String!) {
        validateConfirmationToken(token: $token) {
          ... on SuccessfulResponse {
            isSuccess
          }
          ... on Error {
            message
          }
        }
      }
    `,
    variables: {
      token,
    },
  });

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByToken,
  getUserById,
  deleteUser,
  loginAdmin,
  googleUser,
  facebookUser,
  blockUser,
  unlockUser,
  confirmUserEmail,
  resendEmailToConfirmAdmin,
  recoverUser,
  checkIfTokenIsValid,
  resetPassword,
  sendEmailConfirmation,
  getAllUsersWithToken,
  getUsersForStatistic,
  validateConfirmationToken,
  regenerateAccessToken,
  updateUserById,
  getPurchasedProducts,
  switchUserStatus,
  completeAdminRegister,
  confirmSuperadminCreation,
};
