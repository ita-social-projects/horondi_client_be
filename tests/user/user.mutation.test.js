const mongoose = require('mongoose');
const { gql } = require('@apollo/client');

const { jwtClient } = require('../../client/jwt-client');

const User = require('../../modules/user/user.model');
const { SECRET, TOKEN_EXPIRES_IN } = require('../../dotenvValidator');
const {
  newAdmin,
  testUser,
  user,
  newUser,
  INVALID_FIRST_NAME,
  INVALID_LAST_NAME,
  INVALID_PASSWORD,
  INVALID_ROLE,
  wrongId,
  invalidFirstName,
  invalidLastName,
  invalidPassword,
  invalidToken,
  wrongPassword,
  wrongEmail,
  socialToken,
} = require('./user.variables');
const {
  registerUser,
  facebookUser,
  loginUser,
  blockUser,
  unlockUser,
  checkIfTokenIsValid,
  recoverUser,
  resetPassword,
  sendEmailConfirmation,
  deleteUser,
  confirmUserEmail,
  resendEmailToConfirmAdmin,
  switchUserStatus,
  regenerateAccessToken,
  updateUserById,
  completeAdminRegister,
  confirmSuperadminCreation,
} = require('./user.helper');
const { setupApp } = require('../helper-functions');
const {
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  USER_ALREADY_EXIST,
  WRONG_CREDENTIALS,
  INVALID_PERMISSIONS,
  USER_NOT_FOUND,
  USER_IS_ALREADY_BLOCKED,
  USER_IS_ALREADY_UNLOCKED,
  REFRESH_TOKEN_IS_NOT_VALID,
  RESET_PASSWORD_TOKEN_NOT_VALID,
  AUTHENTICATION_TOKEN_NOT_VALID,
  USER_EMAIL_ALREADY_CONFIRMED,
  USER_IS_BLOCKED,
} = require('../../error-messages/user.messages');
const {
  STATUS_CODES: { FORBIDDEN },
} = require('../../consts/status-codes');

jest.mock('../../modules/email/email.service');

let userId;
let token;
let invitationalToken;
let operations;
let loginedUser;
let recoveryToken;
let confirmationToken;

const {
  firstName,
  lastName,
  language,
  email,
  role,
  phoneNumber,
  address,
  orders,
  comments,
  pass,
} = testUser;

describe('mutations', () => {
  beforeAll(async () => {
    operations = await setupApp();
  });

  test('should register user', async () => {
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
    expect(res.data.registerUser).toHaveProperty('firstName', firstName);
    expect(res.data.registerUser).toHaveProperty('lastName', lastName);
    expect(res.data.registerUser).toHaveProperty('email', email);
    expect(res.data.registerUser).toHaveProperty('role', 'user');
    expect(res.data.registerUser).toHaveProperty('registrationDate');
  });

  test('should authenticate facebook user', async () => {
    const res = await facebookUser(socialToken, true, operations);
    expect(res).toBeDefined();
  });

  test('should throw error User with provided email already exist', async () => {
    const res = await registerUser(
      firstName,
      lastName,
      email,
      pass,
      language,
      operations
    );

    expect(res.data.registerUser.message).toBe(USER_ALREADY_EXIST);
  });
  test('should authorize and receive user token', async () => {
    const res = await loginUser(email, pass, false, operations);
    loginedUser = res.data.loginUser;
    token = res.data.loginUser.token;

    expect(res.data.loginUser).toHaveProperty('token');
    expect(typeof res.data.loginUser.token).toBe('string');
    expect(res.data.loginUser).toHaveProperty('firstName', firstName);
    expect(res.data.loginUser).toHaveProperty('lastName', lastName);
    expect(res.data.loginUser).toHaveProperty('email', email);
    expect(res.data.loginUser).toHaveProperty('registrationDate');
  });

  test('should block User', async () => {
    const result = await blockUser(userId, operations);

    expect(result).toBeDefined();
    expect(result._id).toBe(userId);
  });

  test('should throw error USER_IS_BLOCKED when trying to login user', async () => {
    const result = await loginUser(email, pass, true, operations);

    expect(result.data.loginUser.message).toBe(USER_IS_BLOCKED);
  });

  test('should throw error USER_IS_ALREADY_BLOCKED', async () => {
    const result = await blockUser(userId, operations);

    expect(result.message).toBe(USER_IS_ALREADY_BLOCKED);
  });

  test('should throw error USER_NOT_FOUND', async () => {
    const result = await blockUser(wrongId, operations);

    expect(result.message).toBe(USER_NOT_FOUND);
  });
  test('should unlock User', async () => {
    const result = await unlockUser(userId, operations);

    expect(result).toBeDefined();
    expect(result._id).toBe(userId);
  });

  test('should block and unlock User forever', async () => {
    await blockUser(userId, operations);
    await unlockUser(userId, operations);
    await blockUser(userId, operations);
    const result = await unlockUser(userId, operations);

    expect(result).toBeDefined();
    expect(result._id).toBe(userId);
  });

  test('should throw error USER_IS_ALREADY_UNLOCKED', async () => {
    const result = await unlockUser(userId, operations);

    expect(result.message).toBe(USER_IS_ALREADY_UNLOCKED);
  });

  test('should throw error USER_NOT_FOUND on unlock user', async () => {
    const result = await unlockUser(wrongId, operations);

    expect(result.message).toBe(USER_NOT_FOUND);
  });
  test('should regenerate access token', async () => {
    const res = await regenerateAccessToken(token, operations);

    expect(res).toBeDefined();
  });
  test('should throw error REFRESH_TOKEN_IS_NOT_VALID', async () => {
    const res = await regenerateAccessToken('asd', operations);

    expect(res.message).toBe(REFRESH_TOKEN_IS_NOT_VALID);
  });
  test('should recover User', async () => {
    const res = await recoverUser(email, 0, operations);

    expect(res).toBe(true);
  });
  test('should return true on token valid', async () => {
    const userInfo = await loginUser(email, pass, true, operations);

    recoveryToken = userInfo.data.loginUser.recoveryToken;
    token = userInfo.data.loginUser.token;
    const res = await checkIfTokenIsValid(recoveryToken, operations);

    expect(res.data.checkIfTokenIsValid).toBe(true);
  });
  test('should throw error on checking tokin valid', async () => {
    const res = await checkIfTokenIsValid(token, operations);

    expect(res.errors[0].message).toBe(AUTHENTICATION_TOKEN_NOT_VALID);
  });
  test('should recover User with wrong email', async () => {
    const res = await recoverUser(wrongEmail, 0, operations);

    expect(res).toBe(true);
  });

  test('should reset Password', async () => {
    const res = await resetPassword(pass, recoveryToken, operations);

    expect(res.data.resetPassword).toBe(true);
  });

  test('should throw error on reseting Password', async () => {
    const res = await resetPassword(pass, token, operations);

    expect(res.errors[0].message).toBe(RESET_PASSWORD_TOKEN_NOT_VALID);
  });
  test('should send Email Confirmation', async () => {
    const res = await sendEmailConfirmation(email, 0, operations);

    expect(res.data.sendEmailConfirmation).toBe(true);
  });
  test('should throw Error USER_NOT_FOUND on confirm user email', async () => {
    const result = await confirmUserEmail(token, operations);

    expect(result.message).toBe(USER_NOT_FOUND);
  });
  test('should confirmUserEmail', async () => {
    const userInfo = await loginUser(email, pass, false, operations);

    confirmationToken = userInfo.data.loginUser.confirmationToken;
    token = userInfo.data.loginUser.token;

    const result = await confirmUserEmail(confirmationToken, operations);

    expect(result.confirmed).toBe(true);

    token = result.token;
  });

  test('should throw error USER_EMAIL_ALREADY_CONFIRMED on sending', async () => {
    const res = await sendEmailConfirmation(email, 0, operations);

    expect(res.data.sendEmailConfirmation.message).toBe(
      USER_EMAIL_ALREADY_CONFIRMED
    );
  });
  test('should throw error USER_EMAIL_ALREADY_CONFIRMED on confirm', async () => {
    const result = await confirmUserEmail(confirmationToken, operations);

    expect(result.message).toBe(USER_EMAIL_ALREADY_CONFIRMED);
  });
  test('should resend Email To Confirm Admin', async () => {
    const result = await resendEmailToConfirmAdmin({ email }, operations);

    expect(result.data.resendEmailToConfirmAdmin.isSuccess).toBe(true);
  });
  test('should throw USER_NOT_FOUND error', async () => {
    const result = await resendEmailToConfirmAdmin(
      { email: wrongEmail },
      operations
    );

    expect(result.data.resendEmailToConfirmAdmin.message).toBe(USER_NOT_FOUND);
  });
  test('should confirm Superadmin Creation', async () => {
    const result = await confirmSuperadminCreation({ _id: userId }, operations);

    expect(result.data.confirmSuperadminCreation.isSuccess).toBe(true);
  });
  test('should throw USER_NOT_FOUND error on superadmin', async () => {
    const result = await confirmSuperadminCreation(
      { _id: wrongId },
      operations
    );

    expect(result.data.confirmSuperadminCreation.message).toBe(USER_NOT_FOUND);
  });
  test('should throw error User with provided email not found', async () => {
    const res = await loginUser(wrongEmail, pass, true, operations);
    expect(res.data.loginUser.message).toBe(WRONG_CREDENTIALS);
  });
  test('should throw error Wrong password', async () => {
    const res = await loginUser(email, wrongPassword, true, operations);
    expect(res.data.loginUser.message).toBe(WRONG_CREDENTIALS);
  });
  test('should get wrong credentials when try to update user', async () => {
    operations = await setupApp(loginedUser);

    const { country, city, street, buildingNumber } = address;

    const res = await updateUserById(
      wrongId,
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
    );

    expect(res.data.updateUserById).toHaveProperty(
      'message',
      WRONG_CREDENTIALS
    );
    expect(res.data.updateUserById).toHaveProperty('statusCode', 401);
  });
  test('should update user', async () => {
    const userInfo = await loginUser(email, pass, false, operations);

    userId = userInfo.data.loginUser._id;
    token = userInfo.data.loginUser.token;

    operations = await setupApp();

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
      orders,
      comments,
      token,
      operations
    );

    expect(res.data.updateUserById).toHaveProperty('firstName', 'Updated');
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
    const result = await switchUserStatus(wrongId, operations);
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
  beforeAll(async () => {
    const res = await registerUser(
      user.firstName,
      user.lastName,
      user.email,
      user.pass,
      user.language,
      operations
    );
    userId = res.data.registerUser._id;
  });

  test('User doesn`t allowed to change another user`s data', async () => {
    const res = await registerUser(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.password,
      1,
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

  test('deleting user should throw error USER_NOT_FOUND', async () => {
    operations = await setupApp();
    const res = await deleteUser(wrongId, operations);

    expect(res.data.deleteUser.message).toBe(USER_NOT_FOUND);
  });
});

describe('Register admin', () => {
  const adminRole = 'admin';
  const invalidEmail = 'invalid@com';
  const invalidRole = 'user';
  const superRole = 'superadmin';

  const { email: newAdminEmail } = newAdmin;

  test('Should throw an error when use already in-usage email while admin registration', async () => {
    const result = await operations
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
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
          user: {
            email: 'superadmin@gmail.com',
            role: adminRole,
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
          user: {
            email: newAdminEmail,
            role: invalidRole,
          },
        },
      })
      .catch(err => err);
    const data = result.data.registerAdmin;
    expect(data.message).toEqual(INVALID_ROLE);
    expect(data.statusCode).toEqual(FORBIDDEN);
  });

  test('Should throw an error when use invalid role', async () => {
    const result = await operations
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
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
          user: {
            email: invalidEmail,
            role: invalidRole,
          },
        },
      })
      .catch(err => err);

    const data = result.data.registerAdmin;

    expect(data.message).toEqual(INVALID_ROLE);
    expect(data.statusCode).toEqual(FORBIDDEN);
  });

  test('Should create an user with custom role and generate a confirmation token', async () => {
    const result = await operations
      .mutate({
        mutation: gql`
          mutation($user: AdminRegisterInput!) {
            registerAdmin(user: $user) {
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
          user: {
            email: newAdminEmail,
            role: superRole,
          },
        },
      })
      .catch(err => err);
    const data = result.data.registerAdmin;
    const admin = await User.findOne({ email: newAdminEmail }).exec();
    userId = admin._id;

    jwtClient.setData({ userId });
    const accessToken = jwtClient.generateAccessToken(SECRET, TOKEN_EXPIRES_IN);

    invitationalToken = accessToken;
    expect(data.isSuccess).toEqual(true);
  });

  afterAll(async () => {
    await deleteUser(userId, operations);
  });
});

describe('Admin confirmation', () => {
  const {
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

    expect(data.message).toContain(INVALID_LAST_NAME);
    expect(data.statusCode).toEqual(FORBIDDEN);
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

    expect(data.message).toContain(INVALID_FIRST_NAME);
    expect(data.statusCode).toEqual(FORBIDDEN);
  });

  test('Should throw an error when use invalid password', async () => {
    const result = await completeAdminRegister(
      invitationalToken,
      newAdminFirstName,
      newAdminLastName,
      invalidPassword,
      operations
    );
    const data = result.data.completeAdminRegister;

    expect(data.message).toEqual(INVALID_PASSWORD);
    expect(data.statusCode).toEqual(FORBIDDEN);
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
    const userRole = 'user';

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
            roles: [userRole],
          },
        },
      })
      .catch(err => err);
    const data = result.data.getAllUsers.items;

    expect(data.every(item => item.role === userRole)).toEqual(true);
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
    mongoose.connection.db.dropDatabase();
  });
});
