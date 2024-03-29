const mongoose = require('mongoose');
const { gql } = require('@apollo/client');
const {
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  INVALID_PERMISSIONS,
  WRONG_CREDENTIALS,
} = require('../../error-messages/user.messages');
const {
  superAdminUser,
  testUser,
  testUsersSet,
  wrongId,
  filter,
  socialToken,
} = require('./user.variables');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByToken,
  getUserById,
  sendEmailConfirmation,
  confirmUserEmail,
  deleteUser,
  googleUser,
  facebookUser,
  loginAdmin,
  getAllUsersWithToken,
  validateConfirmationToken,
  getPurchasedProducts,
  getUsersForStatistic,
} = require('./user.helper');
const { setupApp } = require('../helper-functions');
const {
  createUser,
  getAllUsersQuery,
  chooseOnlyUsers,
} = require('../helpers/users');
const {
  RECOVERY_EXPIRE,
  CONFIRMATION_SECRET,
  SECRET,
} = require('../../dotenvValidator');
const { JWTClient, jwtClient } = require('../../client/jwt-client');

jest.mock('../../modules/email/email.service');

let token;
let userId;
let operations;
let loginedUser;

const { firstName, lastName, email, pass, language } = testUser;

const generateAccessTokenMock = secret => {
  const accessTokenMock = jwtClient.createToken(
    { userId },
    secret,
    RECOVERY_EXPIRE
  );
  jest
    .spyOn(JWTClient.prototype, 'generateAccessToken')
    .mockImplementation(() => accessTokenMock);

  return accessTokenMock;
};

describe('queries', () => {
  beforeAll(async () => {
    operations = await setupApp();
    const register = await registerUser(
      firstName,
      lastName,
      email,
      pass,
      language,
      operations
    );
    userId = register.data.registerUser._id;
    const authRes = await loginUser(email, pass, true, operations);
    loginedUser = authRes.data.loginUser;
    token = loginedUser.token;
  });

  test('should receive all users', async () => {
    const res = await getAllUsers(operations);

    expect(res.data.getAllUsers.items[1]).toBeDefined();
  });

  test('should receive user by token', async () => {
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
      role: 'user',
      orders: [],
      comments: [],
      token,
    });
    const res = await getUserByToken(operations);

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
    expect(res.data.getUserByToken).toHaveProperty('orders', []);
    expect(res.data.getUserByToken).toHaveProperty('comments', []);
  });

  test('should receive user by id', async () => {
    operations = await setupApp();
    const res = await getUserById(userId, operations);

    expect(res.data.getUserById).toHaveProperty('_id', userId);
    expect(res.data.getUserById).toHaveProperty('firstName');
    expect(res.data.getUserById).toHaveProperty('lastName');
    expect(res.data.getUserById).toHaveProperty('email', email);
    expect(res.data.getUserById).toHaveProperty('role', 'user');
    expect(res.data.getUserById).toHaveProperty('orders');
    expect(res.data.getUserById).toHaveProperty('comments');
  });

  test('should throw Error User with provided _id not found', async () => {
    const res = await getUserById(wrongId, operations);

    expect(res.data.getUserById.message).toBe('USER_NOT_FOUND');
  });

  test('should get user for statistic', async () => {
    const result = await getUsersForStatistic(filter, operations);

    expect(result.getUsersForStatistic.total).toBeDefined();
  });

  test('should get purchased products', async () => {
    const result = await getPurchasedProducts(userId, operations);

    expect(result).toBeDefined();
  });

  afterAll(async () => {
    await deleteUser(userId, operations);
    await mongoose.connection.db.dropDatabase();
  });
});

describe('Testing obtaining information restrictions', () => {
  let userToken;
  let userLogin;
  let userPassword;
  let adminPassword;
  let newfirstName;
  let wrongPassword;
  let newlastName;
  let adminToken;
  let adminEmail;
  let newlanguage;

  beforeAll(async () => {
    operations = await setupApp();
    userLogin = 'example@gmail.com';
    userPassword = 'qwertY123';
    wrongPassword = 'qw23ertY123';
    adminEmail = superAdminUser.email;
    adminPassword = superAdminUser.password;
    newfirstName = 'Pepo';
    newlastName = 'Markelo';
    newlanguage = 1;
    const register = await registerUser(
      newfirstName,
      newlastName,
      userLogin,
      userPassword,
      newlanguage,
      operations
    );
    userId = register.data.registerUser._id;
    const accessTokenMock = generateAccessTokenMock(CONFIRMATION_SECRET);
    await sendEmailConfirmation(userLogin, language, operations);
    await confirmUserEmail(accessTokenMock, operations);
  });
  test('User must login', async () => {
    const result = await loginUser(userLogin, userPassword, false, operations);
    const userInfo = result.data.loginUser;
    userToken = userInfo.token;

    expect(userInfo).not.toEqual(null);
  });
  test('Admin must login', async () => {
    generateAccessTokenMock(SECRET);
    const result = await loginAdmin(adminEmail, adminPassword, operations);
    const adminInfo = result.data.loginAdmin;
    adminToken = adminInfo.token;
    expect(adminInfo.loginAdmin).not.toEqual(null);
  });

  test('login admin should throw error INVALID_PREMISSIONS', async () => {
    const result = await loginAdmin(userLogin, userPassword, operations);

    expect(result.data.loginAdmin.message).toBe(INVALID_PERMISSIONS);
  });

  test('login admin should throw error WRONG_CREDENTIALS', async () => {
    const result = await loginAdmin(adminEmail, wrongPassword, operations);

    expect(result.data.loginAdmin.message).toBe(WRONG_CREDENTIALS);
  });

  test('Google user must login', async () => {
    const result = await googleUser(socialToken, true, operations);
    expect(result).toBeDefined();
  });
  test('Facebook user must login', async () => {
    const result = await facebookUser(socialToken, true, operations);
    expect(result).toBeDefined();
  });
  test('Any user doesn`t allowed to obtain information about all users', async () => {
    operations = await setupApp({ token: userToken });
    const result = await getAllUsersWithToken(userToken, operations);

    expect(result.data.getAllUsers.message).toBeDefined();
    expect(result.data.getAllUsers.message).toBe(INVALID_PERMISSIONS);
  });
  test('Admin can obtain all the information about users', async () => {
    operations = await setupApp();
    const result = await getAllUsersWithToken(adminToken, operations);
    const data = result.data.getAllUsers.items;

    expect(data.length).toBeGreaterThanOrEqual(2);
  });
  test('User can obtain the information about himself', async () => {
    const userLoginInfo = await loginUser(
      userLogin,
      userPassword,
      true,
      operations
    );
    const result = await getUserById(
      userLoginInfo.data.loginUser._id,
      operations
    );
    const userInfo = result.data.getUserById;

    expect(userInfo.firstName).toEqual(newfirstName);
    expect(userInfo.lastName).toEqual(newlastName);
  });
  test('Should throw an error when validate invalid token', async () => {
    const invalidAdminToken = `y${adminToken.slice(1)}`;
    const result = await validateConfirmationToken(
      invalidAdminToken,
      operations
    );
    const data = result.data.validateConfirmationToken;

    expect(data.message).toEqual(INVALID_ADMIN_INVITATIONAL_TOKEN);
  });
  test('Should return successful response when token is valid', async () => {
    const result = await validateConfirmationToken(adminToken, operations);
    const data = result.data.validateConfirmationToken;

    expect(data.isSuccess).toEqual(true);
  });

  afterAll(async () => {
    await deleteUser(userId, operations);
    await mongoose.connection.db.dropDatabase();
  });
});

describe('Filter users', () => {
  const SORT = {
    byName: { asc: { name: 1 }, desc: { name: -1 } },
    byEmail: { asc: { email: 1 }, desc: { email: -1 } },
  };
  beforeAll(async () => {
    operations = await setupApp();

    for (const user of testUsersSet) {
      await createUser(operations, user);
    }

    const users = await getAllUsersQuery(operations);

    for (const user of users) {
      if (
        testUsersSet.some(
          el =>
            el.firstName === user.firstName && el.banned.blockPeriod === '30'
        )
      ) {
        await operations.mutate({
          mutation: gql`
            mutation ($id: ID!) {
              switchUserStatus(id: $id) {
                ... on SuccessfulResponse {
                  isSuccess
                }
                ... on Error {
                  statusCode
                }
              }
            }
          `,
          variables: {
            id: user._id,
          },
        });
      }
    }
  });

  test('should sort by name from a to z', async () => {
    const compareResult = testUsersSet.map(user => user.firstName).sort();

    let users = await getAllUsersQuery(operations, SORT.byName.asc);

    users = chooseOnlyUsers(users);

    expect(users).toBeDefined();
    expect(users.map(user => user.firstName)).toEqual(compareResult);
  });

  test('should sort by name from z to a', async () => {
    const compareResult = testUsersSet
      .map(user => user.firstName)
      .sort()
      .reverse();

    let users = await getAllUsersQuery(operations, SORT.byName.desc);

    users = chooseOnlyUsers(users);
    expect(users).toBeDefined();
    expect(users.map(user => user.firstName)).toEqual(compareResult);
  });

  test('should sort by email from a to z', async () => {
    const compareResult = testUsersSet
      .map(user => user.email.toLowerCase())
      .sort();
    let users = await getAllUsersQuery(operations, SORT.byEmail.asc);
    users = chooseOnlyUsers(users);

    expect(users).toBeDefined();
    expect(users.map(user => user.email)).toEqual(compareResult);
  });

  test('should sort by email from z to a', async () => {
    const compareResult = testUsersSet
      .map(user => user.email.toLowerCase())
      .sort()
      .reverse();
    let users = await getAllUsersQuery(operations, SORT.byEmail.desc);
    users = chooseOnlyUsers(users);

    expect(users).toBeDefined();
    expect(users.map(user => user.email)).toEqual(compareResult);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });
});
