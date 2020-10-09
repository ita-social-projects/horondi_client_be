/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');
const {
  INVALID_ADMIN_INVITATIONAL_TOKEN,
} = require('../../error-messages/user.messages');
const { setupApp } = require('../helper-functions');
const { getAllUsers } = require('../../modules/user/user.service');

jest.mock('../../modules/confirm-email/confirmation-email.service');

require('dotenv').config();

let token;
let userId;
let operations;

const testUser = {
  firstName: 'Petro',
  lastName: 'Tatsenyak',
  email: 'f5dbb1b213@gmail.com',
  password: '12345678Pt',
  phoneNumber: '380666666666',
  role: 'user',
  language: 1,
  address: {
    country: 'Ukraine',
    city: 'Kiev',
    street: 'Shevchenka',
    buildingNumber: '23',
  },
  wishlist: [],
  orders: [],
  comments: [],
};

describe('queries', () => {
  beforeAll(async () => {
    const { firstName, lastName, email, password, language } = testUser;
    operations = await setupApp();
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
        password,
        language,
      },
    });
    console.log(register);
    userId = register.data.registerUser._id;

    const authRes = await operations.mutate({
      mutation: gql`
        mutation($email: String!, $password: String!) {
          loginUser(loginInput: { email: $email, password: $password }) {
            token
          }
        }
      `,
      variables: {
        email,
        password,
      },
    });
    console.log(token);
    token = authRes.data.loginUser.token;
    const res = await operations.mutate({
      mutation: gql`
        mutation($userId: ID!, $email: String!) {
          updateUserById(
            user: {
              firstName: "Test"
              lastName: "User"
              email: $email
              phoneNumber: "380666666666"
              address: {
                country: "Ukraine"
                city: "Kiev"
                street: "Shevchenka"
                buildingNumber: "23"
              }
              wishlist: []
              orders: []
              comments: []
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
            wishlist
            orders
            comments
          }
        }
      `,
      variables: {
        userId,
        email,
      },
      context: {
        headers: {
          token,
        },
      },
    });
    console.log(res);
  });

  test('should recive all users', async () => {
    const { email } = testUser;
    const res = await operations.query({
      query: gql`
        query {
          getAllUsers {
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
            wishlist
            orders
            comments
          }
        }
      `,
    });
    console.log(res.data.getAllUsers);
    expect(res.data.getAllUsers).toContainEqual({
      firstName: 'Test',
      lastName: 'User',
      email,
      phoneNumber: '380666666666',
      role: 'user',
      address: {
        country: 'Ukraine',
        city: 'Kiev',
        street: 'Shevchenka',
        buildingNumber: '23',
      },
      wishlist: [],
      orders: [],
      comments: [],
    });
  });

  test('should recive user by token', async () => {
    const { email, role } = testUser;
    operations = await setupApp({
      firstName: 'Test',
      lastName: 'User',
      email,
      phoneNumber: '380666666666',
      address: {
        country: 'Ukraine',
        city: 'Kiev',
        street: 'Shevchenka',
        buildingNumber: '23',
      },
      role,
      wishlist: [],
      orders: [],
      comments: [],
      token,
    });
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
              wishlist
              orders
              comments
            }
            ... on Error {
              message
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
    console.log(token);
    console.log(res);
    expect(res.data.getUserByToken).toHaveProperty('firstName', 'Test');
    expect(res.data.getUserByToken).toHaveProperty('lastName', 'User');
    expect(res.data.getUserByToken).toHaveProperty('email', email);
    expect(res.data.getUserByToken).toHaveProperty(
      'phoneNumber',
      '380666666666'
    );
    expect(res.data.getUserByToken).toHaveProperty('role', 'user');
    expect(res.data.getUserByToken).toHaveProperty('address', {
      country: 'Ukraine',
      city: 'Kiev',
      street: 'Shevchenka',
      buildingNumber: '23',
    });
    expect(res.data.getUserByToken).toHaveProperty('wishlist', []);
    expect(res.data.getUserByToken).toHaveProperty('orders', []);
    expect(res.data.getUserByToken).toHaveProperty('comments', []);
  });

  test('should recive user by id', async () => {
    const { email } = testUser;
    operations = await setupApp();
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
            wishlist
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
      },
    });

    expect(res.data.getUserById).toHaveProperty('_id', userId);
    expect(res.data.getUserById).toHaveProperty('firstName', 'Test');
    expect(res.data.getUserById).toHaveProperty('lastName', 'User');
    expect(res.data.getUserById).toHaveProperty('email', email);
    expect(res.data.getUserById).toHaveProperty('phoneNumber', '380666666666');
    expect(res.data.getUserById).toHaveProperty('role', 'user');
    expect(res.data.getUserById).toHaveProperty('address', {
      country: 'Ukraine',
      city: 'Kiev',
      street: 'Shevchenka',
      buildingNumber: '23',
    });
    expect(res.data.getUserById).toHaveProperty('wishlist', []);
    expect(res.data.getUserById).toHaveProperty('orders', []);
    expect(res.data.getUserById).toHaveProperty('comments', []);
  });

  test('should throw Error User with provided _id not found', async () => {
    const res = await operations
      .query({
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
              wishlist
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
          userId: '23ee481430a0056b8e5cc015',
        },
      })
      .catch(err => err);

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe('USER_NOT_FOUND');
  });

  afterAll(async () => {
    await operations.mutate({
      mutation: gql`
        mutation($userId: ID!) {
          deleteUser(id: $userId) {
            _id
          }
        }
      `,
      variables: {
        userId,
      },
    });
  });
});

describe('Testing obtaining information restrictions', () => {
  let userToken;
  let userLogin;
  let userPassword;
  let adminLogin;
  let adminPassword;
  let firstName;
  let lastName;
  let adminToken;

  beforeAll(async () => {
    userLogin = 'example@gmail.com';
    userPassword = 'qwertY123';
    adminLogin = 'admin@gmail.com';
    adminPassword = 'qwertY123';
    firstName = 'Pepo';
    lastName = 'Markelo';
    userId = '5f43af8522155b08109e0304';
    await operations.mutate({
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
        email: userLogin,
        password: userPassword,
        language: 1,
      },
    });
  });

  test('User must login', async () => {
    const result = await operations
      .mutate({
        mutation: gql`
          mutation($user: LoginInput!) {
            loginUser(loginInput: $user) {
              token
              _id
            }
          }
        `,
        variables: {
          user: {
            email: userLogin,
            password: userPassword,
          },
        },
      })
      .catch(err => err);

    const userInfo = result.data;

    expect(userInfo.loginUser).not.toEqual(null);

    userToken = userInfo.loginUser.token;
  });

  test('Admin must login', async () => {
    const result = await operations
      .mutate({
        mutation: gql`
          mutation($admin: LoginInput!) {
            loginAdmin(loginInput: $admin) {
              token
              _id
            }
          }
        `,
        variables: {
          admin: {
            email: adminLogin,
            password: adminPassword,
          },
        },
      })
      .catch(err => err);

    const adminInfo = await result.data;

    expect(adminInfo.loginAdmin).not.toEqual(null);

    adminToken = adminInfo.loginAdmin.token;
  });

  test('Any user doesn`t allowed to obtain information about all users', async () => {
    const result = await operations
      .query({
        query: gql`
          {
            getAllUsers {
              _id
              firstName
              lastName
              email
            }
          }
        `,
        context: {
          headers: {
            token: userToken,
          },
        },
      })
      .catch(err => err);
    console.log(result);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('INVALID_PERMISSIONS');
  });

  test('Admin can obtain all the information about users', async () => {
    const result = await operations
      .query({
        query: gql`
          {
            getAllUsers {
              _id
              firstName
              lastName
              email
            }
          }
        `,
        context: {
          headers: {
            token,
          },
        },
      })
      .catch(err => err);

    const data = result.data.getAllUsers;

    expect(data.length).toBeGreaterThanOrEqual(2);
  });

  test('User can obtain the information about himself', async () => {
    const result = await operations
      .query({
        query: gql`
          query($id: ID!) {
            getUserById(id: $id) {
              firstName
              lastName
            }
          }
        `,
        variables: {
          id: userId,
        },
        context: {
          headers: {
            token: userToken,
          },
        },
      })
      .catch(err => err);

    const userInfo = result.data.getUserById;

    expect(userInfo.firstName).toEqual(firstName);
    expect(userInfo.lastName).toEqual(lastName);
  });

  test('Should throw an error when validate invalid token', async () => {
    const invalidAdminToken = 'y' + adminToken.slice(1);

    const result = await operations
      .query({
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
          token: invalidAdminToken,
        },
      })
      .catch(err => err);

    const data = result.data.validateConfirmationToken;

    expect(data.message).toEqual(INVALID_ADMIN_INVITATIONAL_TOKEN);
  });

  test('Should return successful response when token is valid', async () => {
    const result = await operations
      .query({
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
          token: adminToken,
        },
      })
      .catch(err => err);

    const data = result.data.validateConfirmationToken;

    expect(data.isSuccess).toEqual(true);
  });
});
