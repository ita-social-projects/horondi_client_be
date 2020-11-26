/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
let { adminUser, newAdmin, testUser, newUser } = require('./user.variables');
const { setupApp } = require('../helper-functions');
const {
  INPUT_NOT_VALID,
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  USER_ALREADY_EXIST,
} = require('../../error-messages/user.messages');

jest.mock('../../modules/confirm-email/confirmation-email.service');

let userId;
let token;
let badId;
let invitationalToken;
let operations;
let loginedUser;

describe('mutations', () => {
  beforeAll(async () => {
    badId = '9c031d62a3c4909b216e1d87';
    operations = await setupApp();
  });
  afterAll(async () => {
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
  });

  test('should register user', async () => {
    const { firstName, lastName, email, pass, language } = testUser;

    const res = await operations.mutate({
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
    const { firstName, lastName, email, pass, language } = testUser;

    const res = await operations
      .mutate({
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
      })
      .catch(err => err);

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe('USER_ALREADY_EXIST');
  });

  test('should authorize and recive user token', async () => {
    const { email, pass } = testUser;

    const res = await operations.mutate({
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
            role
            credentials {
              source
              tokenPass
            }
            purchasedProducts
          }
        }
      `,
      variables: {
        email,
        password: pass,
      },
    });
    loginedUser = res.data.loginUser;
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
    const res = await operations
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

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe('WRONG_CREDENTIALS');
  });

  test('should throw error Wrong password', async () => {
    const res = await operations
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

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe('WRONG_CREDENTIALS');
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
    operations = await setupApp(loginedUser);
    const { country, city, street, buildingNumber } = address;

    const res = await operations.mutate({
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
    expect(res.data.updateUserById).toHaveProperty('firstName', 'Updated');
    expect(res.data.updateUserById).toHaveProperty('lastName', 'Updated');
    expect(res.data.updateUserById).toHaveProperty('email', testUser.email);
    expect(res.data.updateUserById).toHaveProperty(
      'phoneNumber',
      testUser.phoneNumber
    );
    expect(res.data.updateUserById).toHaveProperty('role', 'user');
    expect(res.data.updateUserById).toHaveProperty('address', {
      country: testUser.address.country,
      city: testUser.address.city,
      street: testUser.address.street,
      buildingNumber: testUser.address.buildingNumber,
    });
    expect(res.data.updateUserById).toHaveProperty('orders', testUser.orders);
    expect(res.data.updateUserById).toHaveProperty(
      'comments',
      testUser.comments
    );
  });

  test('Should change user status', async () => {
    operations = await setupApp();
    const result = await operations.mutate({
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

  test('should not delete user without super-admin role', async () => {
    operations = await setupApp({ token: 'jgjcdvjkbvdnfjlvdvlf' });
    const res = await operations.mutate({
      mutation: gql`
        mutation($userId: ID!) {
          deleteUser(id: $userId) {
            ... on User {
              _id
            }
            ... on Error {
              message
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });
    expect(res.data.deleteUser.message).toEqual('INVALID_PERMISSIONS');
  });

  test('Should return error when switch status of non-existent user', async () => {
    operations = await setupApp();
    const result = await operations.mutate({
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
  let userToken;
  let { firstName, lastName, email, pass, language } = newUser;

  beforeAll(async () => {
    const res = await operations.mutate({
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
    userId = res.data.registerUser._id;
  });

  test('User must login', async () => {
    const result = await operations
      .mutate({
        mutation: gql`
          mutation($user: LoginInput!) {
            loginUser(loginInput: $user) {
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
              purchasedProducts
            }
          }
        `,
        variables: {
          user: {
            email,
            password: pass,
          },
        },
      })
      .catch(err => err);
    const userInfo = result.data;
    loginedUser = userInfo.loginUser;
    expect(userInfo.loginUser).not.toEqual(null);

    userToken = loginedUser.token;
  });

  test('User doesn`t allowed to change another user`s data', async () => {
    const res = await operations.mutate({
      mutation: gql`
        mutation {
          registerUser(
            user: {
              firstName: "One"
              lastName: "User"
              email: "secretEmail@sec.com"
              password: "qwerty12345"
            }
            language: 1
          ) {
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
    });

    operations = await setupApp({ ...res.data.registerUser });

    const result = await operations
      .mutate({
        mutation: gql`
          mutation(
            $firstName: String!
            $lastName: String!
            $email: String!
            $userId: ID!
          ) {
            updateUserById(
              user: {
                firstName: $firstName
                lastName: $lastName
                email: $email
              }
              id: $userId
            ) {
              firstName
              lastName
            }
          }
        `,
        variables: {
          firstName,
          lastName,
          email,
          userId,
        },
      })
      .catch(err => err);
    expect(result.data.updateUserById.message).toBeDefined();
    expect(result.data.updateUserById.message).toEqual('WRONG_CREDENTIALS');
  });

  test('User can change his own data', async () => {
    operations = await setupApp({ ...loginedUser, token: userToken });
    const res = await operations.mutate({
      mutation: gql`
        mutation($user: UserUpdateInput!, $id: ID!) {
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
    });
    const userInfo = res.data.updateUserById;

    expect(userInfo.firstName).toBe(firstName);
    expect(userInfo.lastName).toBe(lastName);
  });

  test('Admin can delete user', async () => {
    operations = await setupApp();
    const res = await operations.mutate({
      mutation: gql`
        mutation($userId: ID!) {
          deleteUser(id: $userId) {
            ... on User {
              _id
            }
            ... on Error {
              message
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });
    expect(res.data.deleteUser._id).toBeDefined();
  });
});

describe('Register admin', () => {
  let role = 'admin';
  let invalidEmail = 'invalid@com';
  let invalidRole = 'superadmin';

  let { email: newAdminEmail } = newAdmin;

  test('Should throw an error when use already in-usage email while admin registration', async () => {
    const result = await operations
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
            email: 'superadmin@gmail.com',
            role,
          },
        },
      })
      .catch(err => err);

    const data = result.data.registerAdmin;
    expect(data.message).toEqual(USER_ALREADY_EXIST);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid email while admin registration', async () => {
    const result = await operations
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
      })
      .catch(err => err);
    const data = result.data.registerAdmin;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid role', async () => {
    const result = await operations
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
      })
      .catch(err => err);

    const data = result.data.registerAdmin;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should create an user with custom role and generate a confirmation token', async () => {
    const result = await operations
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
              ... on User {
                _id
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
      })
      .catch(err => err);
    const data = result.data.registerAdmin;
    userId = data._id;
    expect(data.email).toEqual(newAdminEmail);

    invitationalToken = data.invitationalToken;
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

describe('Admin confirmation', () => {
  let invalidFirstName = 'H';
  let invalidLastName = 'O';
  let invalidPassword = 'You';
  let invalidToken = `ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2
    VySWQiOiI1ZjU0ZDY1NDE0NWJiNzM3NzQxYmNmMDMiLCJlbWFpbCI6InN1c
    GVyYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNTk5Mzk1NDEyfQ.
    5z1BRqzxF41xmgKr3nDEDBjrv8TxrkOubAEZ3hEOZcw`;
  let {
    pass: newAdminPassword,
    firstName: newAdminFirstName,
    lastName: newAdminLastName,
  } = newAdmin;

  test('Should throw an error when use invalid lastname', async () => {
    const result = await operations
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
    const result = await operations
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
    const result = await operations
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
    const result = await operations
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
    const result = await operations
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
    pass: newAdminPassword,
  } = newAdmin;

  afterAll(async () => {
    await operations.mutate({
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
    });
  });

  test('Should successfully login as an admin', async () => {
    const result = await operations
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
  test('Should receive users via using filters for roles', async () => {
    const role = 'user';

    const result = await operations
      .query({
        query: gql`
          query($filter: UserFilterInput!) {
            getAllUsers(filter: $filter) {
              items {
                role
              }
            }
          }
        `,
        variables: {
          filter: {
            roles: [role],
          },
        },
      })
      .catch(err => err);
    const data = result.data.getAllUsers.items;

    expect(data.every(item => item.role === role)).toEqual(true);
  });

  test('Should receive admins and superadmins via using filters for roles', async () => {
    const roles = ['admin', 'superadmin'];

    const result = await operations
      .query({
        query: gql`
          query($filter: UserFilterInput!) {
            getAllUsers(filter: $filter) {
              items {
                role
              }
            }
          }
        `,
        variables: {
          filter: {
            roles,
          },
        },
      })
      .catch(err => err);

    const data = result.data.getAllUsers.items;

    expect(data.every(item => roles.includes(item.role))).toEqual(true);
  });

  afterAll(async () => {
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
  });
});
