const { gql } = require('@apollo/client');
const {
  INVALID_ADMIN_INVITATIONAL_TOKEN,
  INVALID_PERMISSIONS,
} = require('../../error-messages/user.messages');
let {
  superAdminUser,
  testUser,
  testUsersSet,
  wrongId,
} = require('./user.variables');
let {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByToken,
  getUserById,
  deleteUser,
  loginAdmin,
  getAllUsersWithToken,
} = require('./user.helper');
const { setupApp } = require('../helper-functions');
const {
  createUser,
  getAllUsersQuery,
  chooseOnlyUsers,
} = require('../helpers/users');

jest.mock('../../modules/confirm-email/confirmation-email.service');

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
    operations = await setupApp(loginedUser);
    await operations.mutate({
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
            orders
            comments
          }
        }
      `,
      variables: {
        userId,
        email,
      },
    });
    operations = await setupApp();
  });

  test('should recive all users', async () => {
    const { email } = testUser;
    const res = await getAllUsers(operations);

    expect(res.data.getAllUsers.items).toContainEqual({
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
      orders: [],
      comments: [],
    });
  });

  test('should recive user by token', async () => {
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

  test('should recive user by id', async () => {
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
  });

  test('should throw Error User with provided _id not found', async () => {
    const res = await getUserById(wrongId, operations);

    expect(res.errors.length).toBe(1);
    expect(res.errors[0].message).toBe('USER_NOT_FOUND');
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
    const userLoginInfo = await loginUser(userLogin, userLogin, operations);
    const result = await getUserById(
      userLoginInfo.data.loginUser._id,
      operations
    );
    const userInfo = result.data.getUserById;

    expect(userInfo.firstName).toEqual(firstName);
    expect(userInfo.lastName).toEqual(lastName);
  });
  //
  // test('Should throw an error when validate invalid token', async () => {
  //   const invalidAdminToken = 'y' + adminToken.slice(1);
  //
  //   const result = await operations
  //     .query({
  //       query: gql`
  //         query($token: String!) {
  //           validateConfirmationToken(token: $token) {
  //             ... on SuccessfulResponse {
  //               isSuccess
  //             }
  //             ... on Error {
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: {
  //         token: invalidAdminToken,
  //       },
  //     })
  //     .catch(err => err);
  //
  //   const data = result.data.validateConfirmationToken;
  //
  //   expect(data.message).toEqual(INVALID_ADMIN_INVITATIONAL_TOKEN);
  // });
  //
  // test('Should return successful response when token is valid', async () => {
  //   const result = await operations
  //     .query({
  //       query: gql`
  //         query($token: String!) {
  //           validateConfirmationToken(token: $token) {
  //             ... on SuccessfulResponse {
  //               isSuccess
  //             }
  //             ... on Error {
  //               message
  //             }
  //           }
  //         }
  //       `,
  //       variables: {
  //         token: adminToken,
  //       },
  //     })
  //     .catch(err => err);
  //
  //   const data = result.data.validateConfirmationToken;
  //
  //   expect(data.isSuccess).toEqual(true);
  // });
  afterAll(async () => {
    await deleteUser(userId, operations);
  });
});

// describe('Filter users', () => {
//   const ACTIVE = { banned: false };
//   const BANNED = { banned: true };
//   const SORT = {
//     byName: { asc: { name: 1 }, desc: { name: -1 } },
//     byEmail: { asc: { email: 1 }, desc: { email: -1 } },
//   };
//   let usersId = [];
//
//   beforeAll(async () => {
//     operations = await setupApp();
//
//     for (let i = 0; i < testUsersSet.length; i++) {
//       usersId.push(await createUser(operations, testUsersSet[i]));
//     }
//
//     let users = await getAllUsersQuery(operations);
//
//     for (let i = 0; i < users.length; i++) {
//       if (
//         testUsersSet.some(
//           el => el.firstName === users[i].firstName && el.banned,
//         )
//       ) {
//         await operations.mutate({
//           mutation: gql`
//             mutation($id: ID!) {
//               switchUserStatus(id: $id) {
//                 ... on SuccessfulResponse {
//                   isSuccess
//                 }
//                 ... on Error {
//                   statusCode
//                 }
//               }
//             }
//           `,
//           variables: {
//             id: users[i]._id,
//           },
//         });
//       }
//     }
//   });
//
//   test('should sort by name from a to z', async () => {
//     const compareResult = testUsersSet.map(user => user.firstName).sort();
//
//     let users = await getAllUsersQuery(operations, SORT.byName.asc);
//
//     users = chooseOnlyUsers(users);
//     expect(users).toBeDefined();
//     expect(users.map(user => user.firstName)).toEqual(compareResult);
//   });
//
//   test('should sort by name from z to a', async () => {
//     const compareResult = testUsersSet
//       .map(user => user.firstName)
//       .sort()
//       .reverse();
//
//     let users = await getAllUsersQuery(operations, SORT.byName.desc);
//
//     users = chooseOnlyUsers(users);
//     expect(users).toBeDefined();
//     expect(users.map(user => user.firstName)).toEqual(compareResult);
//   });
//
//   test('should sort by email from a to z', async () => {
//     const compareResult = testUsersSet.map(user => user.email).sort();
//
//     let users = await getAllUsersQuery(operations, SORT.byEmail.asc);
//
//     users = chooseOnlyUsers(users);
//     expect(users).toBeDefined();
//     expect(users.map(user => user.email)).toEqual(compareResult);
//   });
//
//   test('should sort by emaill from z to a', async () => {
//     const compareResult = testUsersSet
//       .map(user => user.email)
//       .sort()
//       .reverse();
//
//     let users = await getAllUsersQuery(operations, SORT.byEmail.desc);
//
//     users = chooseOnlyUsers(users);
//     expect(users).toBeDefined();
//     expect(users.map(user => user.email)).toEqual(compareResult);
//   });
//
//   test('should show only banned users', async () => {
//     const compareResult = testUsersSet
//       .filter(user => user.banned)
//       .map(user => ({ firstName: user.firstName, banned: user.banned }));
//
//     let users = await getAllUsersQuery(operations, {}, BANNED);
//     users = chooseOnlyUsers(users).map(user => ({
//       firstName: user.firstName,
//       banned: user.banned,
//     }));
//     expect(users).toBeDefined();
//     users.forEach(user => {
//       expect(user).toEqual(
//         compareResult.find(el => el.firstName === user.firstName),
//       );
//     });
//   });
//
//   test('should show only not banned users', async () => {
//     const compareResult = testUsersSet
//       .filter(user => !user.banned)
//       .map(user => ({ firstName: user.firstName, banned: user.banned }));
//
//     let users = await getAllUsersQuery(operations, {}, ACTIVE);
//
//     users = chooseOnlyUsers(users).map(user => ({
//       firstName: user.firstName,
//       banned: user.banned,
//     }));
//     expect(users).toBeDefined();
//     users.forEach(user => {
//       expect(user).toEqual(
//         compareResult.find(el => el.firstName === user.firstName),
//       );
//     });
//   });
//
//   afterAll(() => {
//     usersId.forEach(async id => {
//       await operations.mutate({
//         mutation: gql`
//           mutation($id: ID!) {
//             deleteUser(id: $id) {
//               ... on User {
//                 _id
//               }
//               ... on Error {
//                 message
//               }
//             }
//           }
//         `,
//         variables: {
//           id,
//         },
//       });
//     });
//   });
// });
