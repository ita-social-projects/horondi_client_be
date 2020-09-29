const { gql } = require('@apollo/client');
const client = require('../utils/apollo-test-client');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const adminLogin = async user => {
  const result = await client.mutate({
    mutation: gql`
      mutation($user: LoginInput!) {
        loginAdmin(loginInput: $user) {
          token
        }
      }
    `,
    variables: {
      user: {
        email: user ? user.email : process.env.SUPER_ADMIN_EMAIL,
        password: user ? user.password : process.env.SUPER_ADMIN_PASSWORD
      },
    },
  });
  return result.data.loginAdmin.token;
  
};
module.exports = { adminLogin };
