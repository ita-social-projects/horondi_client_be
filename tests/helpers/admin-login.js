const { gql } = require('@apollo/client');
const client = require('../../utils/apollo-test-client');

module.exports = async user => {
  const result = await client.mutate({
    mutation: gql`
      mutation ($user: LoginInput!) {
        loginAdmin(loginInput: $user) {
          token
        }
      }
    `,
    variables: {
      user,
    },
  });

  const { token } = result.data.loginAdmin;

  return token;
};
