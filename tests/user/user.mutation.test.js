const { gql } = require('@apollo/client');
const { newAdmin, testUser, user } = require('./user.variables');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByToken,
  getUserById,
  deleteUser,
  loginAdmin,
  getAllUsersWithToken,
  validateConfirmationToken,
  switchUserStatus,
  updateUserById,
  completeAdminRegister,
} = require('./user.helper');
const { setupApp } = require('../helper-functions');
const {
  createUser,
  getAllUsersQuery,
  chooseOnlyUsers,
} = require('../helpers/users');
const {
  INPUT_NOT_VALID,
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  USER_ALREADY_EXIST,
  WRONG_CREDENTIALS,
  INVALID_PERMISSIONS,
  USER_NOT_FOUND,
} = require('../../error-messages/user.messages');

jest.mock('../../modules/confirm-email/confirmation-email.service');

let userId;
let token;
let badId = '9c031d62a3c4909b216e1d87';
let invitationalToken;
let operations;
let loginedUser;
let wrongEmail = 'udernotfound@gmail.com';
let wrongPassword = '12345678pT';

describe('mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('should register user', async () => {
    const { firstName, lastName, email, pass, language } = testUser;

    const res = await registerUser(
      firstName,
      lastName,
      email,
      pass,
      language,
      operations
    );
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
  });
  test('should throw error User with provided email already exist', async () => {
    const { firstName, lastName, email, pass, language } = testUser;

    const res = await registerUser(
      firstName,
      lastName,
      email,
      pass,
      language,
      operations
    );

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe(USER_ALREADY_EXIST);
  });
  test('should authorize and recive user token', async () => {
    const { email, pass } = testUser;

    const res = await loginUser(email, pass, operations);
    loginedUser = res.data.loginUser;
    token = res.data.loginUser.token;

    expect(res.data.loginUser).toHaveProperty('token');
    expect(typeof res.data.loginUser.token).toBe('string');
    expect(res.data.loginUser).toHaveProperty('firstName', testUser.firstName);
    expect(res.data.loginUser).toHaveProperty('lastName', testUser.lastName);
    expect(res.data.loginUser).toHaveProperty('email', testUser.email);
    expect(res.data.loginUser).toHaveProperty('registrationDate');
  });
  test('should throw error User with provided email not found', async () => {
    const res = await loginUser(wrongEmail, testUser.pass, operations);

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe(WRONG_CREDENTIALS);
  });
  test('should throw error Wrong password', async () => {
    const res = await loginUser(testUser.email, wrongPassword, operations);

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

    const res = await updateUserById(
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
    );

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
    const result = await switchUserStatus(userId, operations);
    const { switchUserStatus: response } = result.data;

    expect(response.isSuccess).toEqual(true);
  });
  test('should not delete user without super-admin role', async () => {
    operations = await setupApp({ token: 'jgjcdvjkbvdnfjlvdvlf' });
    const res = await deleteUser(userId, operations);

    expect(res.data.deleteUser.message).toEqual(INVALID_PERMISSIONS);
  });

  test('Should return error when switch status of non-existent user', async () => {
    operations = await setupApp();
    const result = await switchUserStatus(badId, operations);
    const { switchUserStatus: response } = result.data;

    expect(response.message).toEqual(USER_NOT_FOUND);
    expect(response.statusCode).toEqual(400);
  });

  afterAll(async () => {
    operations = await setupApp();
    await deleteUser(userId, operations);
  });
});

describe('User`s mutation restictions tests', () => {
  let userToken;
  let firstName = user.firstName;
  let lastName = user.lastName;
  let email = user.email;
  let password = user.pass;
  let language = user.language;

  beforeAll(async () => {
    const res = await registerUser(
      firstName,
      lastName,
      email,
      password,
      language,
      operations
    );
    userId = res.data.registerUser._id;
  });

  test('User must login', async () => {
    const result = await loginUser(email, password, operations);
    const loginedUser = result.data.loginUser;
    userToken = loginedUser.token;

    expect(loginedUser).not.toEqual(null);
  });

  test('User doesn`t allowed to change another user`s data', async () => {
    const user = {
      firstName: 'One',
      lastName: 'User',
      email: 'secretEmail@sec.com',
      password: 'qwerty12345',
    };
    const res = await registerUser(
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      (language = 1),
      operations
    );

    operations = await setupApp({ ...res.data.registerUser });

    const result = await operations.mutate({
      mutation: gql`
        mutation(
          $firstName: String!
          $lastName: String!
          $email: String!
          $userId: ID!
        ) {
          updateUserById(
            user: { firstName: $firstName, lastName: $lastName, email: $email }
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
    });

    expect(result.data.updateUserById.message).toBeDefined();
    expect(result.data.updateUserById.message).toEqual(WRONG_CREDENTIALS);

    operations = await setupApp();
    await deleteUser(res.data.registerUser._id, operations);
  });

  test('Admin can delete user', async () => {
    operations = await setupApp();
    const res = await deleteUser(userId, operations);

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
    await deleteUser(userId, operations);
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
    const result = await completeAdminRegister(
      invitationalToken,
      newAdminFirstName,
      invalidLastName,
      newAdminPassword,
      operations
    );
    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid firstname', async () => {
    const result = await completeAdminRegister(
      invitationalToken,
      invalidFirstName,
      newAdminLastName,
      newAdminPassword,
      operations
    );
    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid password', async () => {
    const result = await completeAdminRegister(
      invitationalToken,
      invalidFirstName,
      newAdminLastName,
      invalidPassword,
      operations
    );
    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INPUT_NOT_VALID);
    expect(data.statusCode).toEqual(400);
  });

  test('Should throw an error when use invalid token', async () => {
    const result = await completeAdminRegister(
      invalidToken,
      newAdminFirstName,
      newAdminLastName,
      newAdminPassword,
      operations
    );
    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INVALID_ADMIN_INVITATIONAL_TOKEN);
  });

  test('Should confirm user with a custom role', async () => {
    const result = await completeAdminRegister(
      invitationalToken,
      newAdminFirstName,
      newAdminLastName,
      newAdminPassword,
      operations
    );

    expect(result).toBeTruthy();
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
    await deleteUser(userId, operations);
  });
});
