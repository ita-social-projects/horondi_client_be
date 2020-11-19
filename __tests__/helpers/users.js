const { gql } = require('@apollo/client');
const { setupApp } = require('../helper-functions');
const {
  roles: { USER },
} = require('../../consts/index');
let operations;
const createUser = async ({ firstName, lastName, email, pass, language }) => {
  operations = await setupApp();
  await operations.mutate({
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
          credentials {
            tokenPass
          }
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
};

const getAllUsersQuery = async (token = null, sort = {}, filter = {}) => {
  operations = await setupApp();
  const result = await operations.query({
    query: gql`
      query($sort: UserSortInput, $filter: UserFilterInput) {
        getAllUsers(sort: $sort, filter: $filter) {
          items {
            _id
            firstName
            email
            role
            banned
          }
        }
      }
    `,
    variables: {
      sort,
      filter,
    },
    context: {
      headers: {
        token: token,
      },
    },
  });

  return result.data.getAllUsers.items;
};

const chooseOnlyUsers = arr => {
  return arr.filter(user => user.role === USER);
};

module.exports = {
  createUser,
  getAllUsersQuery,
  chooseOnlyUsers,
};
