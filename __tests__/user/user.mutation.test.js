/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');
const { adminUser, superAdminUser, newAdmin } = require('./user.variables');
const adminLogin = require('../helpers/admin-login');
const {
  INPUT_NOT_VALID,
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  USER_ALREADY_EXIST,
} = require('../../error-messages/user.messages');

require('dotenv').config();

let userId;
let token;
let badId;
let invitationalToken;

const testUser = {
  firstName: 'Petro',
  lastName: 'Tatsenyak',
  email: 'tacjka34@gmail.com',
  password: '12345678Pt',
  phoneNumber: '380666666666',
  role: 'admin',
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

describe('mutations', () => {
  beforeAll(() => {
    badId = '9c031d62a3c4909b216e1d87';
  });

  test('should register user', async () => {
    const { firstName, lastName, email, password } = testUser;

    const res = await client.mutate({
      mutation: gql`
        mutation(
          $firstName: String!
          $lastName: String!
          $email: String!
          $password: String!
        ) {
          registerUser(
            user: {
              firstName: $firstName
              lastName: $lastName
              email: $email
              password: $password
            }
          ) {
            _id
            firstName
            lastName
            email
            role
            registrationDate
          }
        }
      `,
      variables: {
        firstName,
        lastName,
        email,
        password,
      },
    });
    userId = res.data.registerUser._id;

    expect(typeof res.data.registerUser._id).toBe('string');
    expect(res.data.registerUser).toHaveProperty(
      'firstName',
      testUser.firstName
    );
    expect(res.data.registerUser).toHaveProperty('lastName', testUser.lastName);
    expect(res.data.registerUser).toHaveProperty('email', testUser.email);
    expect(res.data.registerUser).toHaveProperty('role', 'user');
    expect(res.data.registerUser).toHaveProperty('registrationDate');
    const date = new Date(
      +res.data.registerUser.registrationDate
    ).toDateString();
    const dateNow = new Date(Date.now()).toDateString();
    expect(dateNow).toBe(date);
  });

  test('should throw error User with provided email already exist', async () => {
    const { firstName, lastName, email, password } = testUser;

    const res = await client
      .mutate({
        mutation: gql`
          mutation(
            $firstName: String!
            $lastName: String!
            $email: String!
            $password: String!
          ) {
            registerUser(
              user: {
                firstName: $firstName
                lastName: $lastName
                email: $email
                password: $password
              }
            ) {
              _id
              firstName
              lastName
              email
              role
              registrationDate
            }
          }
        `,
        variables: {
          firstName,
          lastName,
          email,
          password,
        },
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('USER_ALREADY_EXIST');
  });

  test('should authorize and recive user token', async () => {
    const { email, password } = testUser;

    const res = await client.mutate({
      mutation: gql`
        mutation($email: String!, $password: String!) {
          loginUser(loginInput: { email: $email, password: $password }) {
            _id
            firstName
            lastName
            email
            role
            registrationDate
            token
          }
        }
      `,
      variables: {
        email,
        password,
      },
    });

    expect(res.data.loginUser).toHaveProperty('token');
    expect(typeof res.data.loginUser.token).toBe('string');
    expect(res.data.loginUser).toHaveProperty('firstName', testUser.firstName);
    expect(res.data.loginUser).toHaveProperty('lastName', testUser.lastName);
    expect(res.data.loginUser).toHaveProperty('email', testUser.email);
    expect(res.data.loginUser).toHaveProperty('role', 'user');
    expect(res.data.loginUser).toHaveProperty('registrationDate');

    token = res.data.loginUser.token;
  });

  test('should throw error User with provided email not found', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            loginUser(
              loginInput: {
                email: "udernotfound@gmail.com"
                password: "12345678Pt"
              }
            ) {
              _id
              firstName
              token
            }
          }
        `,
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('WRONG_CREDENTIALS');
  });

  test('should throw error Wrong password', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation($email: String!) {
            loginUser(loginInput: { email: $email, password: "12345678pT" }) {
              _id
              firstName
              token
            }
          }
        `,
        variables: {
          email: testUser.email,
        },
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('WRONG_CREDENTIALS');
  });

  test('should update user by id', async () => {
    const {
      email,
      role,
      phoneNumber,
      address,
      wishlist,
      orders,
      comments,
    } = testUser;

    const { country, city, street, buildingNumber } = address;

    const res = await client.mutate({
      mutation: gql`
        mutation(
          $userId: ID!
          $email: String!
          $phoneNumber: String!
          $role: String!
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
              role: $role
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

    expect(res.data.updateUserById).toHaveProperty('firstName', 'Updated');
    expect(res.data.updateUserById).toHaveProperty('lastName', 'Updated');
    expect(res.data.updateUserById).toHaveProperty('email', testUser.email);
    expect(res.data.updateUserById).toHaveProperty(
      'phoneNumber',
      testUser.phoneNumber
    );
    expect(res.data.updateUserById).toHaveProperty('role', testUser.role);
    expect(res.data.updateUserById).toHaveProperty('address', {
      country: testUser.address.country,
      city: testUser.address.city,
      street: testUser.address.street,
      buildingNumber: testUser.address.buildingNumber,
      __typename: 'Address',
    });
    expect(res.data.updateUserById).toHaveProperty(
      'wishlist',
      testUser.wishlist
    );
    expect(res.data.updateUserById).toHaveProperty('orders', testUser.orders);
    expect(res.data.updateUserById).toHaveProperty(
      'comments',
      testUser.comments
    );
  });

  test('should throw error user with provided id not found', async () => {
    const {
      email,
      role,
      phoneNumber,
      address,
      wishlist,
      orders,
      comments,
    } = testUser;

    const { country, city, street, buildingNumber } = address;

    const res = await client
      .mutate({
        mutation: gql`
          mutation(
            $userId: ID!
            $email: String!
            $phoneNumber: String!
            $role: String!
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
                role: $role
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
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('USER_NOT_FOUND');
  });

  test('should update user by token', async () => {
    const {
      email,
      phoneNumber,
      address,
      wishlist,
      orders,
      comments,
    } = testUser;

    const { country, city, street, buildingNumber } = address;

    const res = await client.mutate({
      mutation: gql`
        mutation(
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
          updateUserByToken(
            user: {
              firstName: "UpdatedByToken"
              lastName: "UpdatedByToken"
              email: $email
              phoneNumber: $phoneNumber
              role: "user"
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
      context: {
        headers: {
          token,
        },
      },
      variables: {
        email,
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

    expect(res.data.updateUserByToken).toHaveProperty(
      'firstName',
      'UpdatedByToken'
    );
    expect(res.data.updateUserByToken).toHaveProperty(
      'lastName',
      'UpdatedByToken'
    );
    expect(res.data.updateUserByToken).toHaveProperty('email', testUser.email);
    expect(res.data.updateUserByToken).toHaveProperty(
      'phoneNumber',
      testUser.phoneNumber
    );
    expect(res.data.updateUserByToken).toHaveProperty('role', 'user');
    expect(res.data.updateUserByToken).toHaveProperty('address', {
      country: testUser.address.country,
      city: testUser.address.city,
      street: testUser.address.street,
      buildingNumber: testUser.address.buildingNumber,
      __typename: 'Address',
    });
    expect(res.data.updateUserByToken).toHaveProperty(
      'wishlist',
      testUser.wishlist
    );
    expect(res.data.updateUserByToken).toHaveProperty(
      'orders',
      testUser.orders
    );
    expect(res.data.updateUserByToken).toHaveProperty(
      'comments',
      testUser.comments
    );
  });

  test('should throw Invalid authorization token error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            updateUserByToken(user: { firstName: "UpdatedByToken" }) {
              firstName
              lastName
              email
              role
            }
          }
        `,
      })
      .catch(err => err);

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('USER_NOT_AUTHORIZED');
  });

  test('should throw Invalid authorization token Error', async () => {
    const res = await client
      .mutate({
        mutation: gql`
          mutation {
            updateUserByToken(user: { firstName: "UpdatedByToken" }) {
              firstName
              lastName
              email
              role
            }
          }
        `,
        context: {
          headers: {
            token:
              'eyJ3bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjA4OWI4MTRjZDQzNDE0NjgzODkxNjAiLCJlbWFpbCI6InRhY2prYTMzNEBnbWFpbC5jb20iLCJpYXQiOjE1OTUwMTA4MTMsImV4cCI6MTU5NTAxNDQxM30.FKxZkqO1Jheij7pPHR3I7y9n3BT9_MK2-i4eCYjuivM',
          },
        },
      })
      .catch(err => err);

    expect(res.networkError.result.errors[0].message).toBe(
      'Context creation failed: Invalid authorization token'
    );
  });

  test('Should change user status', async () => {
    const result = await client.mutate({
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

    const { switchUserStatus: response } = result.data;

    expect(response.isSuccess).toEqual(true);
  });

  test('should delete user', async () => {
    const res = await client.mutate({
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

    expect(res.data.deleteUser._id).toEqual(userId);
  });

  test('Should return error when switch status of non-existent user', async () => {
    const result = await client.mutate({
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
        id: badId,
      },
    });

    const { switchUserStatus: response } = result.data;

    expect(response.message).toEqual('USER_NOT_FOUND');
    expect(response.statusCode).toEqual(400);
  });
});

describe('User`s mutation restictions tests', () => {
  let adminId;
  let userToken;
  let firstName;
  let lastName;
  let email;
  let password;

  beforeAll(() => {
    firstName = 'Pepo';
    lastName = 'Markelo';
    email = 'example@gmail.com';
    password = 'qwertY123';
    adminId = '9c031d62a3c4909b216e1d86';
    userId = '5f43af8522155b08109e0304';
  });

  test('User must login', async () => {
    const result = await client
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
            email,
            password,
          },
        },
      })
      .catch(err => err);

    console.log(result);
    const userInfo = result.data;

    expect(userInfo.loginUser).not.toEqual(null);

    userToken = userInfo.loginUser.token;
  });

  test('User doesn`t allowed to change another user`s data', async () => {
    const result = await client
      .mutate({
        mutation: gql`
          mutation($user: UserInput!, $id: ID!) {
            updateUserById(user: $user, id: $id) {
              firstName
              lastName
            }
          }
        `,
        variables: {
          user: { firstName, lastName, email },
          id: adminId,
        },
        context: {
          headers: {
            token: userToken,
          },
        },
      })
      .catch(err => err);

    expect(result.graphQLErrors.length).toBe(1);
    expect(result.graphQLErrors[0].message).toEqual('WRONG_CREDENTIALS');
  });

  test('User can change his own data', async () => {
    const res = await client.mutate({
      mutation: gql`
        mutation($user: UserInput!, $id: ID!) {
          updateUserById(user: $user, id: $id) {
            firstName
            lastName
          }
        }
      `,
      variables: {
        user: { firstName, lastName, email },
        id: userId,
      },
      context: {
        headers: {
          token: userToken,
        },
      },
    });

    const userInfo = res.data.updateUserById;

    expect(userInfo.firstName).toBe(firstName);
    expect(userInfo.lastName).toBe(lastName);
  });

  test('Unknown user doesn`t allowed to change any data', async () => {
    const result = await client
      .mutate({
        mutation: gql`
          mutation($user: UserInput!, $id: ID!) {
            updateUserById(user: $user, id: $id) {
              firstName
              lastName
            }
          }
        `,
        variables: {
          user: { firstName, lastName, email },
          id: userId,
        },
      })
      .catch(err => err);

    expect(result.graphQLErrors.length).toBe(1);
    expect(result.graphQLErrors[0].message).toEqual('USER_NOT_AUTHORIZED');
  });
});

describe('Register admin', () => {
  let superAdminToken;
  let role = 'admin';
  let invalidEmail = 'invalid@com';
  let adminEmail = adminUser.email;
  let invalidRole = 'superadmin';

  let { email: newAdminEmail } = newAdmin;

  beforeAll(async () => {
    superAdminToken = await adminLogin(superAdminUser);
  });

  test('Should throw an error when use already in-usage email while admin registration', async () => {
    const result = await client
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
              ... on User {
                email
                token
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: {
          user: {
            email: adminEmail,
            role,
          },
        },
        context: {
          headers: {
            token: superAdminToken,
          },
        },
      })
      .catch(err => err);

    const data = result.data.registerAdmin;

    expect(data.message).toEqual(USER_ALREADY_EXIST);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid email while admin registration', async () => {
    const result = await client
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
              ... on User {
                email
                token
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: {
          user: {
            email: newAdminEmail,
            role: invalidRole,
          },
        },
        context: {
          headers: {
            token: superAdminToken,
          },
        },
      })
      .catch(err => err);

    const data = result.data.registerAdmin;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid role', async () => {
    const result = await client
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
              ... on User {
                email
                token
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: {
          user: {
            email: invalidEmail,
            role,
          },
        },
        context: {
          headers: {
            token: superAdminToken,
          },
        },
      })
      .catch(err => err);

    const data = result.data.registerAdmin;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should create an user with custom role and generate a confirmation token', async () => {
    const result = await client
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
              ... on User {
                email
                invitationalToken
              }
              ... on Error {
                message
                statusCode
              }
            }
          }
        `,
        variables: {
          user: {
            email: newAdminEmail,
            role,
          },
        },
        context: {
          headers: {
            token: superAdminToken,
          },
        },
      })
      .catch(err => err);

    const data = result.data.registerAdmin;

    expect(data.email).toEqual(newAdminEmail);

    invitationalToken = data.invitationalToken;
  });
});

describe('Admin confirmation', () => {
  let invalidFirstName = 'H';
  let invalidLastName = 'O';
  let invalidPassword = 'You';
  let invalidToken = `ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2
    VySWQiOiI1ZjU0ZDY1NDE0NWJiNzM3NzQxYmNmMDMiLCJlbWFpbCI6InN1c
    GVyYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNTk5Mzk1NDEyfQ.
    5z1BRqzxF41xmgKr3nDEDBjrv8TxrkOubAEZ3hEOZcw`;
  let {
    password: newAdminPassword,
    firstName: newAdminFirstName,
    lastName: newAdminLastName,
  } = newAdmin;

  test('Should throw an error when use invalid lastname', async () => {
    const result = await client
      .mutate({
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
          token: invitationalToken,
          user: {
            firstName: newAdminFirstName,
            lastName: invalidLastName,
            password: newAdminPassword,
          },
        },
      })
      .catch(err => err);

    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid firstname', async () => {
    const result = await client
      .mutate({
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
          token: invitationalToken,
          user: {
            firstName: invalidFirstName,
            lastName: newAdminLastName,
            password: newAdminPassword,
          },
        },
      })
      .catch(err => err);

    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid password', async () => {
    const result = await client
      .mutate({
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
          token: invitationalToken,
          user: {
            firstName: newAdminFirstName,
            lastName: newAdminLastName,
            password: invalidPassword,
          },
        },
      })
      .catch(err => err);

    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid token', async () => {
    const result = await client
      .mutate({
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
          token: invalidToken,
          user: {
            firstName: newAdminFirstName,
            lastName: newAdminLastName,
            password: newAdminPassword,
          },
        },
      })
      .catch(err => err);

    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INVALID_ADMIN_INVITATIONAL_TOKEN);
  });

  test('Should confirm user with a custom role', async () => {
    const result = await client
      .mutate({
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
          token: invitationalToken,
          user: {
            firstName: newAdminFirstName,
            lastName: newAdminLastName,
            password: newAdminPassword,
          },
        },
      })
      .catch(err => err);

    const { isSuccess } = result.data.completeAdminRegister;

    expect(isSuccess).toEqual(true);
  });
});

describe('New admin login', () => {
  let id;
  let {
    firstName: newAdminFirstName,
    lastName: newAdminLastName,
    email: newAdminEmail,
    password: newAdminPassword,
  } = newAdmin;

  beforeAll(async () => {
    superAdminToken = await adminLogin(superAdminUser);
  });

  afterAll(async () => {
    await client.mutate({
      mutation: gql`
        mutation($id: ID!) {
          deleteUser(id: $id) {
            firstName
          }
        }
      `,
      variables: {
        id,
      },
      context: {
        headers: {
          token: superAdminToken,
        },
      },
    });
  });

  test('Should successfully login as an admin', async () => {
    const result = await client
      .mutate({
        mutation: gql`
          mutation($user: LoginInput!) {
            loginAdmin(loginInput: $user) {
              firstName
              lastName
              _id
              token
            }
          }
        `,
        variables: {
          user: {
            email: newAdminEmail,
            password: newAdminPassword,
          },
        },
      })
      .catch(err => err);

    const data = result.data.loginAdmin;

    expect(data.firstName).toEqual(newAdminFirstName);
    expect(data.lastName).toEqual(newAdminLastName);

    id = data._id;
  });
});

describe('User filtering', () => {
  let superAdminToken;

  beforeAll(async () => {
    superAdminToken = await adminLogin(superAdminUser);
  });

  test('Should receive users via using filters for roles', async () => {
    const role = 'user';

    const result = await client
      .query({
        query: gql`
          query($filter: UserFilterInput) {
            getAllUsers(filter: $filter) {
              role
            }
          }
        `,
        variables: {
          filter: {
            roles: [role],
          },
        },
        context: {
          headers: {
            token: superAdminToken,
          },
        },
      })
      .catch(err => err);

    const data = result.data.getAllUsers;

    expect(data.every(item => item.role === role)).toEqual(true);
  });

  test('Should receive admins and superadmins via using filters for roles', async () => {
    const roles = ['admin', 'superadmin'];

    const result = await client
      .query({
        query: gql`
          query($filter: UserFilterInput) {
            getAllUsers(filter: $filter) {
              role
            }
          }
        `,
        variables: {
          filter: {
            roles,
          },
        },
        context: {
          headers: {
            token: superAdminToken,
          },
        },
      })
      .catch(err => err);

    const data = result.data.getAllUsers;

    expect(data.every(item => roles.includes(item.role))).toEqual(true);
  });
});
