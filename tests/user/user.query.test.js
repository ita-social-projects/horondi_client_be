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
jest.setTimeout(10000);

let token;
let userId;
let operations;
let loginedUser;

describe('queries', () => {
  beforeAll(async done => {
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
    done();
  });

  test('should recive all users', async done => {
    const { email } = testUser;
    const res = await getAllUsers(operations);

    expect(res.data.getAllUsers.items[1]).toContainEqual({
      firstName: 'Petro',
      lastName: 'Tatsenyak',
      email,
      role: 'user',
      orders: [],
      comments: [],
    });
    done();
  });

  test('should recive user by token', async done => {
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
    done();
  });

  test('should recive user by id', async done => {
    const { email } = testUser;
    operations = await setupApp();
    const res = await getUserById(userId, operations);

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
    expect(res.data.getUserById).toHaveProperty('orders');
    expect(res.data.getUserById).toHaveProperty('comments');
    done();
  });

  test('should throw Error User with provided _id not found', async done => {
    const res = await getUserById(wrongId, operations);

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe('USER_NOT_FOUND');
    done();
  });

  afterAll(async done => {
    await deleteUser(userId, operations);
    done();
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

  beforeAll(async done => {
    userLogin = 'example@gmail.com';
    userPassword = 'qwertY123';
    adminEmail = superAdminUser.email;
    adminPassword = superAdminUser.password;
    firstName = 'Pepo';
    lastName = 'Markelo';
    const register = await registerUser(
      firstName,
      lastName,
      userLogin,
      userPassword,
      (language = 1),
      operations
    );
    userId = register.data.registerUser._id;
    done();
  });
  test('User must login', async done => {
    const result = await loginUser(userLogin, userPassword, operations);
    const userInfo = result.data.loginUser;
    userToken = userInfo.token;

    expect(userInfo).not.toEqual(null);
    done();
  });
  test('Admin must login', async done => {
    const result = await loginAdmin(adminEmail, adminPassword, operations);
    const adminInfo = result.data.loginAdmin;
    adminToken = adminInfo.token;

    expect(adminInfo.loginAdmin).not.toEqual(null);
    done();
  });
  test('Any user doesn`t allowed to obtain information about all users', async done => {
    operations = await setupApp({ token: userToken });
    const result = await getAllUsersWithToken(userToken, operations);

    expect(result.data.getAllUsers.message).toBeDefined();
    expect(result.data.getAllUsers.message).toBe(INVALID_PERMISSIONS);
    done();
  });
  test('Admin can obtain all the information about users', async done => {
    operations = await setupApp();
    const result = await getAllUsersWithToken(adminToken, operations);
    const data = result.data.getAllUsers.items;

    expect(data.length).toBeGreaterThanOrEqual(2);
    done();
  });
  test('User can obtain the information about himself', async done => {
    const userLoginInfo = await loginUser(userLogin, userPassword, operations);
    const result = await getUserById(
      userLoginInfo.data.loginUser._id,
      operations
    );
    const userInfo = result.data.getUserById;

    expect(userInfo.firstName).toEqual(firstName);
    expect(userInfo.lastName).toEqual(lastName);
    done();
  });
  test('Should throw an error when validate invalid token', async done => {
    const invalidAdminToken = 'y' + adminToken.slice(1);
    const result = await validateConfirmationToken(
      invalidAdminToken,
      operations
    );
    const data = result.data.validateConfirmationToken;

    expect(data.message).toEqual(INVALID_ADMIN_INVITATIONAL_TOKEN);
    done();
  });
  test('Should return successful response when token is valid', async done => {
    const result = await validateConfirmationToken(adminToken, operations);
    const data = result.data.validateConfirmationToken;

    expect(data.isSuccess).toEqual(true);
    done();
  });

  afterAll(async done => {
    await deleteUser(userId, operations);
    done();
  });
});

describe('Filter users', () => {
  const ACTIVE = {
    banned: {
      blockPeriod: '0',
      blockCount: 1,
    },
  };
  const BANNED = {
    banned: {
      blockPeriod: '30',
      blockCount: 1,
    },
  };
  const SORT = {
    byName: { asc: { name: 1 }, desc: { name: -1 } },
    byEmail: { asc: { email: 1 }, desc: { email: -1 } },
  };
  let usersId = [];

  beforeAll(async done => {
    operations = await setupApp();

    for (let i = 0; i < testUsersSet.length; i++) {
      usersId.push(await createUser(operations, testUsersSet[i]));
    }

    let users = await getAllUsersQuery(operations);

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
    done();
  });

  test('should sort by name from a to z', async done => {
    const compareResult = testUsersSet.map(user => user.firstName).sort();

    let users = await getAllUsersQuery(operations, SORT.byName.asc);

    users = chooseOnlyUsers(users);
    expect(users).toBeDefined();
    expect(users.map(user => user.firstName)).toEqual(compareResult);
    done();
  });

  test('should sort by name from z to a', async done => {
    const compareResult = testUsersSet
      .map(user => user.firstName)
      .sort()
      .reverse();

    let users = await getAllUsersQuery(operations, SORT.byName.desc);

    users = chooseOnlyUsers(users);
    expect(users).toBeDefined();
    expect(users.map(user => user.firstName)).toEqual(compareResult);
    done();
  });

  test('should sort by email from a to z', async done => {
    const compareResult = testUsersSet.map(user => user.email).sort();
    let users = await getAllUsersQuery(operations, SORT.byEmail.asc);
    users = chooseOnlyUsers(users);

    expect(users).toBeDefined();
    expect(users.map(user => user.email)).toEqual(compareResult);
    done();
  });

  test('should sort by emaill from z to a', async done => {
    const compareResult = testUsersSet
      .map(user => user.email)
      .sort()
      .reverse();
    let users = await getAllUsersQuery(operations, SORT.byEmail.desc);
    users = chooseOnlyUsers(users);

    expect(users).toBeDefined();
    expect(users.map(user => user.email)).toEqual(compareResult);
    done();
  });

  test('should show only banned users', async done => {
    const compareResult = testUsersSet
      .filter(user => user.banned.blockPeriod === '30')
      .map(user => ({ firstName: user.firstName, banned: user.banned }));

    let users = await getAllUsersQuery(operations, {}, BANNED);
    users = chooseOnlyUsers(users).map(user => ({
      firstName: user.firstName,
      banned: user.banned,
    }));

    expect(users).toBeDefined();
    users.forEach(user => {
      expect(user).toEqual(
        compareResult.find(el => el.firstName === user.firstName)
      );
    });
    done();
  });

  test('should show only not banned users', async done => {
    const compareResult = testUsersSet
      .filter(user => user.banned.blockPeriod === '0')
      .map(user => ({ firstName: user.firstName, banned: user.banned }));

    let users = await getAllUsersQuery(operations, {}, ACTIVE);

    users = chooseOnlyUsers(users).map(user => ({
      firstName: user.firstName,
      banned: user.banned,
    }));
    expect(users).toBeDefined();
    users.forEach(user => {
      expect(user).toEqual(
        compareResult.find(el => el.firstName === user.firstName)
      );
    });
    done();
  });

  afterAll(async done => {
    await Promise.all(
      usersId.map(async id => {
        await deleteUser(id, operations);
      })
    );
    done();
  });
});
