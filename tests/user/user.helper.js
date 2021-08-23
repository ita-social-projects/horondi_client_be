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
  wishlist,
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
        $wishlist: [ID!]!
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
            wishlist: $wishlist
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
      wishlist,
      orders,
      comments,
    },
  });

  return updatedUser;
};
const loginUser = async (email, pass, operations) => {
  const loginedUser = await operations.mutate({
    mutation: gql`
      mutation($email: String!, $password: String!) {
        loginUser(loginInput: { email: $email, password: $password }) {
          token
          firstName
          lastName
          comments
          _id
          email
          password
          phoneNumber
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
          wishlist {
            _id
          }
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
    },
  });
  return loginedUser;
};
const googleUser = async (idToken, staySignedIn, operations) => {
  const googleUser = await operations.mutate({
    mutation: gql`
      mutation($idToken: String!, $staySignedIn: Boolean) {
        googleUser(idToken: $idToken, staySignedIn: $staySignedIn) {
          token
          _id
        }
      }
    `,
    variables: {
      idToken,
      staySignedIn,
    },
  });
  return googleUser.data.googleUser;
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
  console.log(res);
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
const getCountUserOrders = async (userId, operations) => {
  const count = await operations.query({
    query: gql`
      query($userId: ID!) {
        getCountUserOrders(id: $userId) {
          countOrder
        }
      }
    `,
    variables: {
      userId,
    },
  });
  return count.data.getCountUserOrders;
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
  getCountUserOrders,
  getUserById,
  deleteUser,
  loginAdmin,
  googleUser,
  blockUser,
  unlockUser,
  getAllUsersWithToken,
  getUsersForStatistic,
  validateConfirmationToken,
  regenerateAccessToken,
  updateUserById,
  getPurchasedProducts,
  switchUserStatus,
  completeAdminRegister,
};
