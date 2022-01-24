const { gql } = require('@apollo/client');

const {
  roles: { USER },
} = require('../../consts/index');

const createUser = async (
  operations,
  { firstName, lastName, email, pass, language }
) => {
  const register = await operations.mutate({
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

  return register.data.registerUser._id;
};

const getAllUsersQuery = async (operations, sort = {}, filter = {}) => {
  const result = await operations.query({
    query: gql`
      query($sort: UserSortInput, $filter: UserFilterInput) {
        getAllUsers(sort: $sort, filter: $filter) {
          items {
            _id
            firstName
            email
            role
            banned {
              blockPeriod
              blockCount
            }
          }
        }
      }
    `,
    variables: {
      sort,
      filter,
    },
  });

  return result.data.getAllUsers.items;
};

const chooseOnlyUsers = (arr) => arr.filter((user) => user.role === USER);

module.exports = {
  createUser,
  getAllUsersQuery,
  chooseOnlyUsers,
};
