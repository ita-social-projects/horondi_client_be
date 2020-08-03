/* eslint-disable no-undef */
const { gql } = require('apollo-boost');
const client = require('../../utils/apollo-test-client');

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
            user: { email: "test.email@gmail.com", password: "12345678Te" }
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
      },
      wishlist: [],
      orders: [],
      comments: [],
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
      'test.email@gmail.com',
    );
    expect(res.data.getUserByToken).toHaveProperty(
      'phoneNumber',
      '380666666666',
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
      'test.email@gmail.com',
    );
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

  test('should trow Error User with provided _id not found', async () => {
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
    expect(res.graphQLErrors[0].message).toBe(
      'User with provided _id not found',
    );
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
