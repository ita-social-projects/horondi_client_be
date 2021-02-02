const { gql } = require('@apollo/client');

const registerUser = async (
  firstName,
  lastName,
  email,
  pass,
  language,
  operations
) => {
  const register = await operations.mutate({
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
  return register;
};
const loginUser = async (email, pass, operations) => {
  const authRes = await operations.mutate({
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
          cart {
            dimensions {
              volumeInLiters
            }
            _id
            sidePocket
            selectedSize
          }
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
  return authRes;
};
const getAllUsers = async operations => {
  const res = await operations.query({
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
  return res;
};
const getUserByToken = async operations => {
  const res = await operations.query({
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
  return res;
};
const getUserById = async (userId, operations) => {
  const res = await operations.query({
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
  return res;
};
const deleteUser = async (userId, operations) => {
  await operations.mutate({
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
};
const loginAdmin = async (email, password, operations) => {
  const result = await operations.mutate({
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
  return result;
};
const getAllUsersWithToken = async (token, operations) => {
  const result = await operations.query({
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
  return result;
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByToken,
  getUserById,
  deleteUser,
  loginAdmin,
  getAllUsersWithToken,
};
