const { gql } = require('@apollo/client');
const {
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  INVALID_PERMISSIONS,
} = require('../../error-messages/user.messages');
const {
  superAdminUser,
  testUser,
  testUsersSet,
  wrongId,
} = require('./user.variables');
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
} = require('./user.helper');
const { setupApp } = require('../helper-functions');
const {
  createUser,
  getAllUsersQuery,
  chooseOnlyUsers,
} = require('../helpers/users');

jest.mock('../../modules/email/email.service');
jest.setTimeout(30000);

let token;
let userId;
let operations;
let loginedUser;

describe('queries', () => {
  beforeAll(async () => {
    const { firstName, lastName, email, pass, language } = testUser;

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

    const authRes = await loginUser(email, pass, operations);
    loginedUser = authRes.data.loginUser;
    token = loginedUser.token;
  });

  test.skip('should recive all users', async () => {
    const { email } = testUser;
    const res = await getAllUsers(operations);

    expect(res.data.getAllUsers.items[1]).toHaveProperty(
      'firstName',
      'Super admin'
    );
    expect(res.data.getAllUsers.items[1]).toHaveProperty('email', email);
    expect(res.data.getAllUsers.items[1]).toHaveProperty('role', 'user');
  });

  test('should receive user by token', async () => {
    const { email } = testUser;
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
      wishlist: [],
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
    const { email } = testUser;
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

  afterAll(async () => {
    await deleteUser(userId, operations);
  });
});

describe('Testing obtaining information restrictions', () => {
  let userToken;
  let userLogin;
  let userPassword;
  let adminPassword;
  let firstName;
  let lastName;
  let adminToken;
  let adminEmail;
  let language;

  beforeAll(async () => {
    operations = await setupApp();
    userLogin = 'example@gmail.com';
    userPassword = 'qwertY123';
    adminEmail = superAdminUser.email;
    adminPassword = superAdminUser.password;
    firstName = 'Pepo';
    lastName = 'Markelo';
    language = 1;
    const register = await registerUser(
      firstName,
      lastName,
      userLogin,
      userPassword,
      language,
      operations
    );
    userId = register.data.registerUser._id;
  });
  test('User must login', async () => {
    const result = await loginUser(userLogin, userPassword, operations);
    const userInfo = result.data.loginUser;
    userToken = userInfo.token;

    expect(userInfo).not.toEqual(null);
  });
  test('Admin must login', async () => {
    const result = await loginAdmin(adminEmail, adminPassword, operations);
    const adminInfo = result.data.loginAdmin;
    adminToken = adminInfo.token;

    expect(adminInfo.loginAdmin).not.toEqual(null);
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
    const userLoginInfo = await loginUser(userLogin, userPassword, operations);
    const result = await getUserById(
      userLoginInfo.data.loginUser._id,
      operations
    );
    const userInfo = result.data.getUserById;

    expect(userInfo.firstName).toEqual(firstName);
    expect(userInfo.lastName).toEqual(lastName);
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
  });
});

describe('Filter users', () => {
  const SORT = {
    byName: { asc: { name: 1 }, desc: { name: -1 } },
    byEmail: { asc: { email: 1 }, desc: { email: -1 } },
  };
  const usersId = [];

  beforeAll(async () => {
    operations = await setupApp();

    for (let i = 0; i < testUsersSet.length; i++) {
      usersId.push(await createUser(operations, testUsersSet[i]));
    }

    const users = await getAllUsersQuery(operations);

    for (let i = 0; i < users.length; i++) {
      if (
        testUsersSet.some(
          el =>
            el.firstName === users[i].firstName &&
            el.banned.blockPeriod === '30'
        )
      ) {
        await operations.mutate({
          mutation: gql`
            mutation($id: ID!) {
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
            id: users[i]._id,
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
    const compareResult = testUsersSet.map(user => user.email).sort();
    let users = await getAllUsersQuery(operations, SORT.byEmail.asc);
    users = chooseOnlyUsers(users);

    expect(users).toBeDefined();
    expect(users.map(user => user.email)).toEqual(compareResult);
  });

  test('should sort by email from z to a', async () => {
    const compareResult = testUsersSet
      .map(user => user.email)
      .sort()
      .reverse();
    let users = await getAllUsersQuery(operations, SORT.byEmail.desc);
    users = chooseOnlyUsers(users);

    expect(users).toBeDefined();
    expect(users.map(user => user.email)).toEqual(compareResult);
  });

  afterAll(async () => {
    await Promise.all(
      usersId.map(async id => {
        await deleteUser(id, operations);
      })
    );
  });
});
