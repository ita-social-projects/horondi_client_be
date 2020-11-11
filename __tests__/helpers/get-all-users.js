const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');

module.exports = async (token = null, sort = {}, filter = {}) => {
  const result = await client.query({
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

  return await result.data.getAllUsers.items;
};
