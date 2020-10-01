/* eslint-disable no-undef */
const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');
const {
  INVALID_ADMIN_INVITATIONAL_TOKEN,
} = require('../../error-messages/user.messages');

require('dotenv').config();

let token;
let userId;

describe('queries', () => {
  beforeAll(async () => {
    const register = await client.mutate({
      mutation: gql`
        mutation {
          registerUser(
            user: {
              firstName: "Test"
              lastName: "User"
              email: "test.email@gmail.com"
              password: "12345678Te"
            }
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
    });

    userId = register.data.registerUser._id;

    const authRes = await client.mutate({
      mutation: gql`
        mutation {
          loginUser(
            loginInput: {
              email: "test.email@gmail.com"
              password: "12345678Te"
            }
          ) {
            token
          }
        }
      `,
    });
    token = authRes.data.loginUser.token;

    await client.mutate({
      mutation: gql`
        mutation {
          updateUserByToken(
            user: {
              firstName: "Test"
              lastName: "User"
              email: "test.email@gmail.com"
              phoneNumber: "380666666666"
              role: "user"
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
    });
  });

  test('should recive all users', async () => {
    const res = await client.query({
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

    expect(res.data.getAllUsers).toContainEqual({
      firstName: 'Test',
      lastName: 'User',
      email: 'test.email@gmail.com',
      phoneNumber: '380666666666',
      role: 'user',
      address: {
        country: 'Ukraine',
        city: 'Kiev',
        street: 'Shevchenka',
        buildingNumber: '23',
        __typename: 'Address',
      },
      wishlist: [],
      orders: [],
      comments: [],
      __typename: 'User',
    });
  });

  test('should recive user by token', async () => {
    const res = await client.query({
      query: gql`
        query {
          getUserByToken {
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
    });

    expect(res.data.getUserByToken).toHaveProperty('firstName', 'Test');
    expect(res.data.getUserByToken).toHaveProperty('lastName', 'User');
    expect(res.data.getUserByToken).toHaveProperty(
      'email',
      'test.email@gmail.com'
    );
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
      __typename: 'Address',
    });
    expect(res.data.getUserByToken).toHaveProperty('wishlist', []);
    expect(res.data.getUserByToken).toHaveProperty('orders', []);
    expect(res.data.getUserByToken).toHaveProperty('comments', []);
    expect(res.data.getUserByToken).toMatchSnapshot();
  });

  test('should recive user by id', async () => {
    const res = await client.query({
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
    expect(res.data.getUserById).toHaveProperty(
      'email',
      'test.email@gmail.com'
    );
    expect(res.data.getUserById).toHaveProperty('phoneNumber', '380666666666');
    expect(res.data.getUserById).toHaveProperty('role', 'user');
    expect(res.data.getUserById).toHaveProperty('address', {
      country: 'Ukraine',
      city: 'Kiev',
      street: 'Shevchenka',
      buildingNumber: '23',
      __typename: 'Address',
    });
    expect(res.data.getUserById).toHaveProperty('wishlist', []);
    expect(res.data.getUserById).toHaveProperty('orders', []);
    expect(res.data.getUserById).toHaveProperty('comments', []);
  });

  test('should throw Error User with provided _id not found', async () => {
    const res = await client
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

    expect(res.graphQLErrors.length).toBe(1);
    expect(res.graphQLErrors[0].message).toBe('USER_NOT_FOUND');
  });

  afterAll(async () => {
    await client.mutate({
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

  beforeAll(() => {
    userLogin = 'example@gmail.com';
    userPassword = 'qwertY123';
    adminLogin = 'admin@gmail.com';
    adminPassword = 'qwertY123';
    firstName = 'Pepo';
    lastName = 'Markelo';
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
    const result = await client
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
    const result = await client
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

    expect(result.graphQLErrors.length).toBe(1);
    expect(result.graphQLErrors[0].message).toBe('INVALID_PERMISSIONS');
  });

  test('Admin can obtain all the information about users', async () => {
    const result = await client
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
            token: adminToken,
          },
        },
      })
      .catch(err => err);

    const data = result.data.getAllUsers;

    expect(data.length).toBeGreaterThan(3);
  });

  test('User can obtain the information about himself', async () => {
    const result = await client
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

    const result = await client
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
    const result = await client
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
